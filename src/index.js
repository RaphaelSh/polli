import React from "react";
import { render} from "react-dom";
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
//import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';


import rootReducer from './rootReducer';
import App from './components/App';
//import { setCurrentUser } from './actions/signup';
//import setAuthorizationToken from './components/utils/setAuthorizationToken';

import rootSaga from './sagas';
import createSagaMiddleware from 'redux-saga'


//import Auth from './components/signup/auth/Auth';

//const auth = new Auth();
const sagaMiddleware = createSagaMiddleware()


const store = createStore(
  rootReducer,
  compose(
   // applyMiddleware(thunk),
    applyMiddleware( sagaMiddleware ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

sagaMiddleware.run(rootSaga)

render(
        <Provider store = {store}>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </Provider>,
        document.getElementById('root')
      );