

/* ******************************* 
    basic action creators exports                                    
******************************* */

export const fetchPoll = poll_id => 
    dispatch =>  dispatch ({ type: 'FETCH_POLL', poll_id }); 


export const fetchPolls = user_id => 
    dispatch =>  dispatch({ type: 'FETCH_POLLS', user_id }); 


export const fetchAllPolls = poll_type =>
     dispatch =>  dispatch ({ type: 'FETCH_ALL_POLLS', poll_type }); 
    

export const addNewPoll = pollData  => 
    dispatch =>  dispatch ({ type: 'ADD_NEW_POLL', pollData }); 


export const updatePoll =  pollData =>  
   dispatch =>  dispatch ({ type: 'UPDATE_POLL', pollData }); 


export const deletePoll = poll_id => 
   dispatch =>  dispatch ({ type: 'DELETE_POLL', poll_id }); 


export const saveVote = poll_data =>  
    dispatch =>  dispatch ({ type: 'VOTE', poll_data }); 


