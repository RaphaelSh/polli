import React,{ Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

import home from './home';
import NavigationBar from './NavigationBar';

import signupPage from './signup/signupPage';
import loginPage from './signup/loginPage';

import pollForm from './polls/pollForm';
import pollsPage from './polls/pollsPage/pollsPage';
import pollPage from './polls/pollPage';

import FlashMessagesList from './utils/flashMessages';
import requireAuth from './utils/requireAuth'; 


import './style/app.css';

const windowHeight = window.innerHeight; // extra padding

class App extends Component{
    
    state = { pos : 0 }
    
    callback = () => {
            let { lastPos, op } = this.props, curPos = this.state.pos;
            if( curPos > windowHeight) {this.props.opacityAnim( 'PAGE_CROSSED_LIMIT', windowHeight ); return;}
                
            this.props.opacityAnim( curPos >= lastPos ? 'PAGE_SCROLL_DOWN' : 
                                    (( curPos < windowHeight && op < 1 ) ? 'PAGE_SCROLL_UP' : 'PAGE_CROSSED_LIMIT' ), curPos );
    }
    
    throtle_event = _.throttle( this.callback, 100 );
    
    scroll = (e) =>{
            this.setState({ pos : e.target.scrollTop });
            this.throtle_event(); 
    }

        
    render () {
        const scroll_props = this.props.match.isExact? { onScroll:this.scroll }: {};
        
        return (
            <div className = 'mainpage' { ...scroll_props }>
                <Route path="/" component={ NavigationBar }/>
                <Route path="/" component={ FlashMessagesList }/>
                <Route exact path="/" component = { home } />
                
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
const mapStateToProps = ({ home_animations }) => {
    return {...home_animations};
}

const mapDispatchToProps = dispatch => ({
   opacityAnim : ( type, curPos ) => dispatch ({ type, curPos })
})


export default withRouter(connect( mapStateToProps, mapDispatchToProps )(App));