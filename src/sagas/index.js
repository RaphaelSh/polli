
import { all, take, call, put } from 'redux-saga/effects'

import { requestResource, requestToAddUser } from './sagasRequests';
import setAuthorizationToken from '../components/utils/setAuthorizationToken';
//
//////////////////////////////////////////////////////////////////////////////////////
/*                                  POLLS                                           */
//////////////////////////////////////////////////////////////////////////////////////

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


//////////////////////////////////////////////////////////////////////////////////////
/*                              HOME-ANIMATIONS                                     */
//////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////////////////////////////////////////////////////
/*                              SIGNUP/LOGIN                                        */
//////////////////////////////////////////////////////////////////////////////////////

function* signUpRequestSaga () {
   while (true) {
       const { userData } = yield take ('SIGN_UP');
       yield call( requestToAddUser, 'SET_CURRENT_USER', { type: 'post', url: '/api/users' }, userData );

   } 
}

function* doesUserExistSaga () {
    while (true) {
        const { userData } = yield take ('DOES_USER_EXIST'), { name , value } = userData;
        yield call( requestResource, 'VERIFICATION_ERRORS', { type: 'get', url: `/api/users/?${name}=${value}` } );
    }
}


function* loginSaga () {
    while (true) {
        const { userData } = yield take ('LOGIN'), { identifier, password } = userData;
        yield call( requestToAddUser, 'SET_CURRENT_USER', { type: 'post', url: '/api/auth' }, { identifier, password } );
    }
}

function* logoutSaga () {

    while (true) {
        yield take ('LOGOUT');
        yield window.localStorage.removeItem('clientData');
        yield setAuthorizationToken(false);
        yield put ({
            type: 'SET_CURRENT_USER',
            user:{} 
        });
    }   
}

// ---------------------- actions order ---------------------- //


//  voting sequal
// -----------------
/*
function* loginFlow () {
    while (true) {
        yield call(fetchAllPollsSaga);
        yield call( saveVoteSaga );
    }
}

//  editing existing poll
// -----------------------

function* editing_existing_polls () {
    yield all([
        call (addNewPollSaga),
        call (updatePollSaga),
        call (deletePollSaga)
    ]);   
}
*/


export default function* root() {
    yield all([
        
        call(signUpRequestSaga),
        call(doesUserExistSaga),
        call(loginSaga),
        call(logoutSaga),

        call(fetchAllPollsSaga),
        call( saveVoteSaga ),
        call (fetchPollSaga ),
        call ( fetchPollsSaga ),
        call (addNewPollSaga),
        call (updatePollSaga),
        call (deletePollSaga)    
    ]);  
}
