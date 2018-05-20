
import { take, call, put } from 'redux-saga/effects'


import { auth } from '../auth/Auth';
import { AUTH_CONFIG, NON_INTERACTIVE_CONFIG } from '../auth/auth0-variables';

import { validateInput } from '../common/functions/signup';

import axios from 'axios';
import { isEmpty } from 'lodash';

import { passwordChecker } from '../components/utils/auth-utils';

const { auth0, login, loginGoogle } = auth;
const { clientId, domain, databaseConnection } = AUTH_CONFIG;

const { client_id, client_secret } = NON_INTERACTIVE_CONFIG;


// sign-up
// -------

const handle_user_exist_error = name => name ==='username' ? 
            { username: 'username already exist.' } : 
            { email: 'the provided email already exist. are you a returning member?'};


export function* signUpRequestSaga ( ) {
    while (true) {
        const { userData } = yield take ('SIGN_UP');
        userData.client_id = clientId;
        userData.connection = databaseConnection;

        window.localStorage.setItem('pconnection','db');
        
        const signup = () => new Promise ( (res,rej) => 
            auth0.redirect.signupAndLogin({ 
                connection: databaseConnection, 
                ...userData,
              },( err, result ) => { 
                  if(err) { return rej(err); } 
                  return res(result ); 
             })
        );

        try { 
            yield call(signup); 
        }
        catch (error) {
            const { code, name } = error;
            let errors = {};
            
            if (/(user|username)(?=_exists)/g.test(code)) {
                errors = Object.assign(errors, handle_user_exist_error(code.split('_')[0]));
            }
            else if ( code ==='invalid_password' ) {
                if ( name === "PasswordNoUserInfoError" ) {
                    errors.passwordChecker = passwordChecker( userData );
                    errors.passwordCheckerNameEmail = 'Please change your password so your username or email would not be included in it.'
                }
                else if ( name === 'PasswordDictionaryError' ) {
                    errors.passwordCheckerNameEmail = 'The password you picked is too common. Please change it.'
                    errors.passwordChecker = passwordChecker( userData )-25;
                }
                else if ( name === 'PasswordStrengthError' ) {
                    errors.passwordChecker = passwordChecker( userData );
                }
            }
            
            else if (code ==='invalid email address') { errors.email = 'Email is invalid'; }
            
            else if (/(email|password)(?=\sis\srequired)/gi.test(code)) {
                const match = code.match(/(email|password)(?=\sis\srequired)/gi)[0],
                match_to_use = match.replace(/(^[a-z]{1})/g,p=>p.toUpperCase());
                errors[match] = `${match_to_use} is required`;
            }
            
            else if (/missing\susername\sfor\sUsername-Password-Authentication/gi.test(code)) {
                errors.username = 'Username is required';
            } 
            
            
            yield put({
                type: 'REQUEST_REJECTED',
                error: isEmpty( errors )? error.messege||
                                        error.description||
                                        error.code||
                                        error.name||
                                        error
                                        : errors
            });
        
        }
    }
}
// --------


// check if user exist 
// -------------------
const requestToken = () => new Promise(( res, rej ) => {
    axios({
        url: "https://gili.eu.auth0.com/oauth/token",
        method: "post",
        headers: { "content-type": "application/json" },
        data: { grant_type : "client_credentials",
                client_id,
                client_secret,
                audience: `https://${ domain }/api/v2/`
        }
    }).then(result => res(result))
        .catch(err => rej(err));
});

const searchUser = ( token, query ) => new Promise ( (res, rej) => {
    axios({
        url: "https://gili.eu.auth0.com/api/v2/users",
        method: "get",
        headers: { authorization: `Bearer ${ token }` },
        params: { 
            q: query,
            search_engin:'v3'
        }
    }).then(result => res(result))
        .catch(err => rej(err));
});

export function* doesUserExistSaga () {
    while (true) {
        const { userData } = yield take ('DOES_USER_EXIST'), { name , value } = userData;
        try {
            const token = yield call( requestToken ), { access_token } = token.data;
            const { data } = yield call( searchUser, access_token, `${name}:"${value}"`);
            
            let payload = {}; 
            if( data[0] ) {
                payload = Object.assign(payload, handle_user_exist_error(name));
            }
            else {
                let query = {}; query[ name ] = value;
                const { errors, isValid } = validateInput(query);
                payload[name] = isValid ? '' : errors[name];
            }
            yield put({
                type:'VERIFICATION_ERRORS',
                payload
            })
        }
        catch (err) {
            console.error('token-error: ',err);
        }
        
    }
}

// -------
 
export function* loginSaga () {
    while (true) {
        const { userData } = yield take ('LOGIN'), { email, password } = userData;
        window.localStorage.setItem('pconnection','db');

        try { 
            yield call( login, email, password );
        }
        catch (error) {
            yield put({
                type: 'REQUEST_REJECTED',
                error: { login: error.error_description }
            });
        }
    }
}

export function* loginGoogleSaga () {
    while (true) {
        yield take ('LOGIN_GOOGLE');
        window.localStorage.setItem('pconnection','google');

        try { 
            yield call( loginGoogle );
        }
        catch (error) {
            console.log('error: ',error);
            yield put({
                type: 'REQUEST_REJECTED',
                error
            });
        }
    }
}


export function* logoutSaga () {

    while (true) {
        yield take ('LOGOUT');
        window.localStorage.removeItem('access_token');
        window.localStorage.removeItem('id_token');
        window.localStorage.removeItem('expires_at');
        yield put ({
            type: 'SET_CURRENT_USER',
            user:'' 
        });
    }   
}
