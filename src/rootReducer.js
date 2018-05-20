import { combineReducers } from 'redux';

import flashMessages from './reducers/flashMessages';
import auth from './reducers/auth';
import polls from './reducers/polls';
import navbar_opacity from './reducers/navbar_opacity';
import resize from './reducers/resize';

export default combineReducers ({
    flashMessages,
    auth,
    polls,
    navbar_opacity,
    resize, 
});
