
import { delay } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import axios from 'axios';


/* ******************************* 
            sagas                                    
******************************* */
const fetchApi = (type, url, extra_data ) => axios[type](url, extra_data);

function* requestApi( api_data ,data ) {
  let timeOut = [1000, 2000, 4000, 8000, 16000];
  for(let i = 0; i < 5; i++) {
    try {
      const { type, url } = api_data;
      const apiResponse = yield call( fetchApi, type, url, data );
      return apiResponse;
    } catch (err) {
      if(i < 4) {
        yield call( delay, timeOut.shift() );
      }
    }
  }
  // attempts failed after 5 attempts
  throw new Error('API request failed');
}

export function* requestResource( success_action, api_data , extra_data = {} ) {

    try {
      const apiResponse = yield call( requestApi, api_data , extra_data );
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

