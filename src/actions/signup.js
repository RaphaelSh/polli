
//import { handleResponse } from '../common/functions/signup'; 
import axios from 'axios';
import setAuthorizationToken from '../components/utils/setAuthorizationToken';
import jwt from 'jsonwebtoken';

export const setCurrentUser = user => ({   
        type: 'SET_CURRENT_USER',
        user
});

export const saveUserOnClient = (userData ,dispatch, URL) => {
    
    return axios.post('/api/'+URL, userData, { withCredentials: true })
        .then(({ data }) => {
            window.localStorage.setItem('clientData',data);
            setAuthorizationToken(data);
            dispatch(setCurrentUser(jwt.decode(data)));
            return data;
        },
        err => err
    );
};    

export function doesUserExist(identifier) {
    return dispatch => axios.get(`/api/users/${identifier}`);
};

export function signUpRequest (userData) {
    return dispatch => saveUserOnClient( userData ,dispatch, 'users');
};

export const login = (userData) =>{
    return dispatch => saveUserOnClient( userData ,dispatch, 'auth');
};

export function logout() {
    return dispatch => {
        window.localStorage.removeItem('clientData');
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
    }
}