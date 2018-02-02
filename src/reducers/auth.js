import isEmpty from 'lodash/isEmpty';

const initialState = {
    isAuthenticated: false,
    user: {}
}

export default (state = initialState, action = {}) => {
    switch (action.type){
        case 'SET_CURRENT_USER':
            const { username, id } = action.user;
            return {
                isAuthenticated: !isEmpty(action.user),
                user: { username, id }
            };
        default: return state;
    }
}