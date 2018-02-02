import { combineReducers } from 'redux';

import flashMessages from './reducers/flashMessages';
import auth from './reducers/auth';
import polls from './reducers/polls';


export default combineReducers ({
    flashMessages,
    auth,
    polls
});
