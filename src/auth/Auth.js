//import history from '../history';
import auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';
import { withRouter } from "react-router-dom";

export class Auth {
  
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientId,
    redirectUri: AUTH_CONFIG.callbackUrl,
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    responseType: 'token id_token',
    scope: 'openid profile username'
  });

  constructor () {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.loginGoogle = this.loginGoogle.bind(this);
  }
  
 
  handleAuthentication () { 
    return new Promise( (res, rej ) => {
    //  const decodedString = decode(window.localStorage.getItem('auth0-authorize'));
      this.auth0.parseHash((err, authResult) => {
        if ( authResult && authResult.accessToken && authResult.idToken ) {
            console.log('authResult: ',authResult)
            this.setSession(authResult);
            return res(authResult);
          } else if (err) {
            alert(`Error: ${ err.error }. Check the console for further details.`);
            return rej(err);
          }
      })
      
    });
  }
  
  checkSession () {
    return new Promise((res,rej) => {
        this.auth0.checkSession({}, (err, authResult) => {
          if(err) { return rej(err); }
          return res(authResult);
        });
    });
  }
   
  login ( email, password ) {
    return new Promise ( (res, rej) => {
      this.auth0.login({
        realm: AUTH_CONFIG.databaseConnection,
        email: email,
        password: password
      }, (err, token ) => {
        if( err ) return rej(err);
        res(token);
      });
    });
  }
  
  loginGoogle ()  {
      return new Promise( (res,rej) => { 
        this.auth0.authorize({
          connection: 'google-oauth2'
        },err=>rej(err));
      });
  }
  
  setSession (authResult, connection_type) {
    console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
    // Set the time that the access token will expire at
    let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    window.localStorage.setItem('access_token', authResult.accessToken);
    window.localStorage.setItem('id_token', authResult.idToken);
    window.localStorage.setItem('expires_at', expiresAt);
    // navigate to the home route
    //history.replace('/home');
  }

  logout () {
    // Clear access token and ID token from local storage
    window.localStorage.removeItem('access_token');
    window.localStorage.removeItem('id_token');
    window.localStorage.removeItem('expires_at');
    window.localStorage.removeItem('pconnection');
    
    window.location = AUTH_CONFIG.callbackUrl;
    // navigate to the home route
    //history.replace('/home');
  }

  isAuthenticated () {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}

export const auth = withRouter(new Auth());
