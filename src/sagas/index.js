
import { all, take, call } from 'redux-saga/effects'

import { requestResource } from './sagasRequests';


    // fetch a single poll                                        
function* fetchPollSaga () {
    while (true) {
        const { poll_id } = yield take ('FETCH_POLL' );
        yield call( requestResource, 'POLL_FETCHED', {type: 'get',url: `/api/polls/poll/${poll_id}`} );
    }
}

    // fetch user's poll
function* fetchPollsSaga () { 
    while (true) {
        const { user_id } = yield take ('FETCH_POLLS');
        yield call( requestResource, 'SET_POLLS', { type: 'get', url: `/api/polls/${user_id}` } ); 
    }
}

    // fetch polls sortd by type at homepage
function* fetchAllPollsSaga () { 
    while (true) {
        const { poll_type } = yield take ('FETCH_ALL_POLLS');
        yield call( requestResource,'SET_POLLS', { type: 'get', url: `/api/polls/?type=${poll_type}`} );
    }
}    

    // add a new poll                                    
function* addNewPollSaga () {
    while (true) {
        const { pollData } = yield take ('ADD_NEW_POLL');
        yield call( requestResource, 'POLL_ADDED', { type: 'post', url: `/api/polls`}, pollData );
    }
}

    // update a single poll
function* updatePollSaga () { 
    while (true) {
        const { pollData } = yield take ('UPDATE_POLL');
        yield call( requestResource, 'POLL_UPDATED', { type: 'put', url: `/api/polls`}, pollData );
    }
} 

    // delete a poll                                             
function* deletePollSaga () { 
    while (true) {
        const { poll_id } = yield take ('DELETE_POLL');
        yield call( requestResource, 'POLL_DELETED', { type: 'delete', url: `/api/polls/${poll_id}` });
    }
}

    // place a vote  
function* saveVoteSaga () { 
    while (true) {
        const { poll_data } = yield take ('VOTE');
        yield call( requestResource, 'POLL_VOTED', { type: 'put', url: `/api/polls/vote` }, poll_data );
    }
}


export default function* root() {
  
  yield all([
    call( fetchPollSaga ),
    call( fetchPollsSaga ),
    call( fetchAllPollsSaga ),
    call( addNewPollSaga ),
    call( updatePollSaga ),
    call( deletePollSaga ),
    call( saveVoteSaga )
  ]);
  
}
