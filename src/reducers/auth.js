import isEmpty from 'lodash/isEmpty';

const initialState = {
    isAuthenticated: false,
    user: {}
}

export default (state = initialState, action = {}) => {
    console.log('action.user: ',action.user)
    switch (action.type){
        case 'REQUEST_REJECTED' : if(action.error ==='Invalid Credentials') return { ...state, errors: action.error };
        case 'SET_CURRENT_USER':
            const { username, id } = action.user;
            return {
                isAuthenticated: !isEmpty(action.user),
                user: { username, id },
                errors: {}
            };
        case 'VERIFICATION_ERRORS': return {...state, errors: action.payload };
        default: return state;
    }
}