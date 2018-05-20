import React,{ Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

import home from './home';
import NavigationBar from './NavigationBar';

import signupPage from './signup/signupPage';

import pollForm from './polls/pollForm';
import pollsPage from './polls/pollsPage/pollsPage';
import pollPage from './polls/pollPage';

import FlashMessagesList from './utils/flashMessages';
import requireAuth from './utils/requireAuth'; 

import Loading from '../common/elements/loadingElement';

import './style/app.css';

import { auth } from '../auth/Auth';

const decode = token => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
};

class App extends Component {
  
    constructor(props) {
        super(props);
        this.state = { isAuthenticated: null, loading: true }
    }
    
    
    onWindowResize = (e) => {
        _.debounce(this.props.resize, 100)();
    }

    componentWillUnMount () {
        window.removeEventListener( 'resize',  _.debounce(this.props.resize, 100) );
    }
    
    scrollFunc () {
        this.setState({ scroll:true })
    }
    
    componentDidMount () {

        window.addEventListener('resize',  _.debounce(this.props.resize, 100));
     //   window.addEventListener('scroll',_.throttle(this.scroll,100));

    // auth
    
        const { location, setUser } = this.props, w = window.localStorage,
        t = w.getItem('id_token'), exp = new Date().getTime() < w.getItem('expires_at');
        
        // if the user is logged in and refreshes the page
        const google = w.getItem('pconnection') === 'google';
        
        const setuser = decoded => {
            let { nickname, sub, picture } = decoded;
            sub = sub.split('|')[1];
            return setUser({ name: nickname, _id: sub, picture });
        };
        const removeuser = () => {
            setUser({});
            auth.logout();
        }
        
        if( w.getItem('access_token') && t ) {
            
            if( google ) { ( exp && setuser(decode(t)) ) || removeuser() }
            else {
                auth.checkSession()
                .then(({ idTokenPayload }) => setuser(idTokenPayload))
                .catch( err => removeuser(err) );  
            }
            
        }
        
        else if (/access_token|id_token|error/.test(location.hash)) {
                auth.handleAuthentication()
                    .then(({ idTokenPayload }) =>  {
                        setuser(idTokenPayload);
                        this.props.addFlashMessages({
                                type: 'success',
                                text: `Welcome ${idTokenPayload.nickname}!`
                        });
       
                    })
                    .catch( err => removeuser(err));
        }
        
        else { this.setState({ loading:false }); }
    }
    
    componentWillReceiveProps (nextProps) {
            this.setState({ loading:false });
    }
    
    
    
    
    
    render () {

        return this.state.loading? <Loading/>:(
            <div id='mainpage' className = 'mainpage' >
                
                <Route path="/" component={ NavigationBar } />
                <Route path="/" component={ FlashMessagesList }/>
                <Route exact path="/" component = { home } />
                
                <Route path="/pollPage/:_id" component = { pollPage } />
                
                <Route path="/signup/:s_o_l" component={ signupPage } />

                <Route exact path="/newpoll" component={ requireAuth( pollForm ) } />
                <Route path="/newpoll/:_id" component = { requireAuth( pollForm ) } />
                
                <Route path="/mypolls" component={ requireAuth( pollsPage ) } />
                
            </div>
            );
    }
}
const mapStateToProps = ({ home_animations, auth } ) => {
    return { ...home_animations, 
             isAuthenticated: auth.isAuthenticated 
    };
}

const mapDispatchToProps = dispatch => ({
    opacityAnim : ( type, curPos ) => dispatch ({ type, curPos }),
    resize: () => { dispatch ({ type:'RESIZE' })},
    setUser: user => dispatch({ type: 'SET_CURRENT_USER', user }),
    addFlashMessages: message =>  dispatch({ type: 'ADD_FLASH_MESSAGE', message })
});


export default withRouter(connect( mapStateToProps, mapDispatchToProps )(App));
