import React from "react";
import { render} from "react-dom";
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import jwt from 'jsonwebtoken';


import rootReducer from './rootReducer';
import App from './components/App';
import { setCurrentUser } from './actions/signup';
import setAuthorizationToken from './utils/setAuthorizationToken';

import rootSaga from './sagas';
import createSagaMiddleware from 'redux-saga'
const sagaMiddleware = createSagaMiddleware()


const store = createStore(
  rootReducer,
  compose(
   // applyMiddleware(thunk),
    applyMiddleware( thunk, sagaMiddleware ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

sagaMiddleware.run(rootSaga)


if(window.localStorage.clientData){
    setAuthorizationToken(window.localStorage.clientData);
    store.dispatch(setCurrentUser(jwt.decode(window.localStorage.clientData)));
}

render(
      <Provider store = {store}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Provider>,
        document.getElementById('root')
      );