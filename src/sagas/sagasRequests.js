
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import axios from 'axios';
import jwt from 'jsonwebtoken';

import setAuthorizationToken from '../components/utils/setAuthorizationToken';

/* ******************************* 
            sagas                                    
******************************* */

const fetchApi = (type, url, extra_data, withCredentials ) => axios[type](url, extra_data, { withCredentials: withCredentials });

/////////////////

function* requestApi( api_data ,data, withCredentials ) {
  
  let timeOut = [1000, 2000, 4000, 8000, 16000];
  
  for(let i = 0; i < 5; i++) {
    try {
      const { type, url } = api_data;
      const apiResponse = yield call( fetchApi, type, url, data, withCredentials );
      console.log('apiResponse: ',apiResponse);
      return apiResponse;
    } catch (err) {
      if(err.response.data.error === 'Invalid Credentials') throw err.response.data.error;
      if(i < 4) {
        yield call( delay, timeOut.shift() );
      }
    }
  }
  // attempts failed after 5 attempts
  throw new Error('API request failed');
}

/////////////////

export function* requestResource( success_action, api_data , extra_data = {} ) {

    try {
      const apiResponse = yield call( requestApi, api_data , extra_data, false );
      yield put({
        type: success_action,
        payload: apiResponse.data
      });
      
    } catch (error) {
      yield put({
        type: 'REQUEST_REJECTED',
        error
      });
    }
}

/////////////////

export function* requestToAddUser( success_action, api_data, userData ) {
    
    try {
      const { data } = yield call( requestApi, api_data, userData , true );
      yield window.localStorage.setItem( 'clientData', data );
      yield setAuthorizationToken(data);
      yield put({
        type: success_action,
        user: jwt.decode(data)
      });
      
    } catch (error) {
            console.log('requestToAddUser- error: ',error);

      yield put({
        type: 'REQUEST_REJECTED',
        error
      });
    }
}
