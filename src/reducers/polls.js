

export default (state=[], { type, payload } = {}) => {
    
    switch(type){
        case 'SET_POLLS': return payload;
        
        case 'POLL_ADDED': return [ ...state, payload ];
        
        case 'POLL_DELETED': return state.filter ( item => item._id !== payload );

        case 'POLL_UPDATED': {
            return state.map( item => item._id === payload._id ? 
                Object.assign(  payload,
                                { owner: item.owner },
                                { sum: payload.options.reduce(( acc,{ votes })=> acc + votes ,0 )}
                            ) 
                : item 
            );
        }
        case 'POLL_VOTED': {
            const index = state.findIndex(item => item._id === payload._id ),
            options = state[index].options.map( opt => 
                opt._id === payload.opt_id ?
                    Object.assign( opt, { votes: opt.votes+1 }): opt
            );
            let newstate = state.slice();
            newstate[index] = Object.assign({}, state[index], { options, sum: state[index].sum+1 });
            console.log('newstate: ',newstate)
            return newstate;
        }

        case 'POLL_FETCHED': {
            const index = state.findIndex(item => item._id === payload._id);
            if( index > -1 ) return state.map( item => item._id === payload._id ? payload : item );
            else return [ ...state, payload ];
        }
        
        default: return state;
    }
};
