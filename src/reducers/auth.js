import isEmpty from 'lodash/isEmpty';

const initialState = {
    isAuthenticated: false,
    user: {},
    errors:{}
}

export default (state = initialState, action = {}) => {
    switch (action.type){
        case 'CLEAR_ERRORS': return { ...state, errors: '' }
        case 'REQUEST_REJECTED' : {
            return { ...state, errors: action.error };}
        case 'SET_CURRENT_USER': {
            return {...state,
                isAuthenticated: !isEmpty(action.user),
                user: action.user
            };
        }
        case 'VERIFICATION_ERRORS': return {...state, errors: action.payload };
        default: return { ...state };
    }
}