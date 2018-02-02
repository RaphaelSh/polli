import React,{ Component } from 'react';
import { Route } from 'react-router-dom';

import home from './home';
import NavigationBar from './NavigationBar';
import FlashMessagesList from './flashMessages';
import signupPage from './signup/signupPage';
import loginPage from './signup/loginPage';
import pollForm from './polls/pollForm';
import pollsPage from './polls/pollsPage';
import pollPage from './polls/pollPage';

import requireAuth from '../utils/requireAuth';



class App extends Component{
    render(){
        return (
            <div>
                <Route path="/" component={ NavigationBar }/>
                <Route path="/" component={ FlashMessagesList }/>
                <Route exact path="/" component={ home }/>
                
                <Route path="/signup" component={ signupPage } />
                <Route path="/login" component={ loginPage } />
                
                <Route exact path="/newpoll" component={ requireAuth( pollForm ) } />
                <Route path="/newpoll/:_id" component = { requireAuth( pollForm ) } />
                
                <Route path="/pollPage/:_id" component = { pollPage } />
                
                <Route path="/mypolls" component={ requireAuth( pollsPage ) } />
            </div>
            );
    }
}

export default App;