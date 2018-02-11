import { combineReducers } from 'redux';

import flashMessages from './reducers/flashMessages';
import auth from './reducers/auth';
import polls from './reducers/polls';
import home_animations from './reducers/home_animations';


export default combineReducers ({
    flashMessages,
    auth,
    polls,
    home_animations
});
