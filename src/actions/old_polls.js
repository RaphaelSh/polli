
import axios from 'axios';

/*----------------------------------------------------*/

const addPollToStore = poll => ({
    type: 'ADD_POLL',
    poll
});

export function addNewPoll (pollData) {
    return dispatch => axios.post('/api/polls',pollData)
            .then( ({data}) => dispatch(addPollToStore( data )));
}

/*----------------------------------------------------*/

const addPollsToStore = polls => ({
    type: 'SET_POLLS',
    polls
});

export function fetchPolls (user_id) {
    return dispatch => axios.get(`/api/polls/${user_id}`)
            .then( ({ data }) => dispatch(addPollsToStore( data )));
}

/*----------------------------------------------------*/

export function fetchAllPolls (type) {
    return dispatch => axios.get(`/api/polls/?type=${type}`)
        .then( ({ data }) => {
            return dispatch(addPollsToStore( data ))});
}

/*----------------------------------------------------*/

const fetchedPoll = poll => ({
    type: 'POLL_FETCHED',
    poll
});

export function fetchPoll (poll_id) {
    return dispatch => axios.get(`/api/polls/poll/${poll_id}`)
            .then( ({ data }) => {
                return dispatch(fetchedPoll( data ))})
}

/*----------------------------------------------------*/

const updatedPoll = poll => ({
    type: 'UPDATE_POLL',
    poll
});

export function updatePoll (pollData) {
    return dispatch => axios.put(`/api/polls`,pollData)
            .then( ({ data }) => {
                return dispatch(updatedPoll( data ))
            });
}

/*----------------------------------------------------*/

const deletedPoll = pollId => ({
    type: 'DELETE_POLL',
    pollId
});

export function deletePoll (pollId) {
    return dispatch => {
        axios.delete(`/api/polls/${pollId}`)
        .then(()=>dispatch( deletedPoll( pollId )));
    };
}

/*----------------------------------------------------*/



export function saveVote (pollData) {

return dispatch => axios.put(`/api/polls`,pollData)
        .then(({ data }) => dispatch(updatedPoll( data )))
}




