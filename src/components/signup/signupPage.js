import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import classnames from 'classnames';
//import _ from 'lodash';
//import { Form, Grid, Segment } from 'semantic-ui-react';

import FormField from '../../common/elements/formField';
import FormButton from '../../common/elements/formButton';
import SingupLoginImg from './signup_login_image';
import SignUpForm from './signup';
import clearFormSlowly from './clearForm';
import { header_style, cont, form, body } from './styles'; 
import { passwordChecker, passwordCheckerNameEmail } from '../utils/auth-utils';

import { validateInput } from '../../common/functions/signup';
import Popup from '../../common/elements/popup';

function filterState (arr) {
    return  arr.reduce((acc,cur) => Object.assign( {},acc, {[cur] : this.state[cur]}),{} );
}

function checkFormFilled (form) {
            let isValid = true, f = Array.from(form);
            let obj = filterState.call(this, form);
            while( isValid === true && f.length) {
                const key = f.shift();
                if( !obj[key] ) { isValid = false; }
            }
            return isValid?'':'error';
}

const checkErrors = (errors,page_status) => {
            if( errors ==={} ) { return true; }
            let isValid = true, arr = Object.keys(errors);
            while( isValid === true && arr.length) {
                const key = arr.shift();
                if( key!=='passwordChecker' && errors[key] !=='' ) { isValid = false; }
                if( page_status && key === 'passwordChecker' && errors[key] !== 100) { isValid = false; }
            }
            return isValid;
}

class SignupPage extends React.Component {
    
    constructor (props) {
        super(props);
        this.state = {
            page_status: Number(props.match.params.s_o_l) ? true : false,
            
            username: '',
            email: '',
            password: '',
            psConfirm: '',

            email_login:'',
            password_login:'',
            
            errors: {},
            isFocused: {},
            isValid:true,
            
            isLoading: false,
            
            showPopup: false
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.checkIfUserExists = this.checkIfUserExists.bind(this);
        this.change_page = this.change_page.bind(this);
        this.login = this.login.bind(this);
        this.hoverFuncForPassword = this.hoverFuncForPassword.bind(this);
        this.dismissPopup = this.dismissPopup.bind(this);
    
    }
    
    onChange (e) { 
        const { isFocused } = this.state, { name, value } = e.target;
       // this.setState({ passwordChecker: passwordChecker(e.target.value) })
        isFocused[e.target.name] = true;
        this.setState({
            [name]: value,
            isFocused,
            showPopup:false,
        });
        
        let { errors } = this.state;
        
        if ( this.state.errors[name] ) {
            errors[name] = '';
            errors.login = '';
        }
        
        if( name === 'password' && value ) {
            const { username, email } = this.state;
            errors.passwordChecker = passwordChecker( value, username, email );
                if ( passwordCheckerNameEmail(value, username, email) ) {
                    errors.passwordCheckerNameEmail = 'Please change your password so your username or email would not be included in it.'
                }
                else { errors.passwordCheckerNameEmail = ''; }
        }
        
        this.setState(({ errors }));
    } 

    isValid ( data ) {
        const { isValid } = validateInput(data);
        if(!isValid) { 
            let { errors } = this.state;
            errors = {...errors, ...validateInput(data).errors};
            this.setState ({ errors })
        }
        return isValid;
    }
   
    componentWillReceiveProps ( nextProps ) {
        // this code will happen only in case of signup/login errors
        const { errors, page_status } = this.state, newErrors = nextProps.errors;
        let finalErrors = Object.assign( {}, errors, newErrors );
        let isValid = checkErrors(finalErrors,page_status);
        this.setState({ errors: finalErrors , isValid });
    }
    
    
    onSubmit (e) { // signup
        e.preventDefault();
        const { username, email, password, psConfirm} = this.state;
        if( this.isValid({ username, email, password, psConfirm } )){
           this.setState({ errors: {}, isLoading:true });
           this.props.signUpRequest({ username, email, password });
        }
    }
    
    login (e) {
        const {email_login, password_login} = this.state;
        if( this.isValid({ email_login, password_login })) {
            this.setState({ errors: {}, isLoading : true });
            this.props.login({ email: email_login, password: password_login });
        }
    }
    
    
    checkIfUserExists (e) {
        
        let { name, value } = e.target, { password, psConfirm, isFocused, page_status, errors } = this.state;
        const form = page_status ? ['username','email','password','psConfirm']:['email_login','password_login'];

        if( value === '' ) { 
            isFocused[ e.target.name ] = false; 
            if( name === 'password' ){ 
                errors.passwordChecker = undefined; 
                errors.passwordCheckerNameEmail = ''; 
            }
        }
        
        errors.formFilled = checkFormFilled.call(this, form);

        let isValid = true, otherErrors={};
        
        if (/password$|psConfirm/g.test(name)) {
            isValid = this.isValid({ password, psConfirm });
            if(!isValid) { otherErrors = validateInput({ password, psConfirm }).errors; }
        }
        
        if (/login/g.test(name)) { 
            isValid = this.isValid(filterState.call( this, form )); 
            if(!isValid) { otherErrors = validateInput(filterState.call( this, form )).errors ; }
        }

        if( isValid ) {  isValid = checkErrors(errors, page_status); }
        
        this.setState({ typedField: name, isFocused, showPopup:false, errors:{...errors, ...otherErrors }, isValid });
        
        if( /username|email$/g.test(name) ) { this.props.doesUserExist ( { name, value }); }
        
    }
    
    change_page (e) {
        clearFormSlowly.call(this);
        this.setState({ page_status: !this.state.page_status });
    }
    
    hoverFuncForPassword () {
        if( !this.state.isFocused.password ) { this.setState({ showPopup: true });}
    }
    
    dismissPopup () {  this.setState({ showPopup: false }); }
    
    render () {
        
        const { errors, 
                username, 
                email, 
                password, 
                psConfirm,
                email_login,
                password_login,
                isValid,
                isLoading, 
                page_status, 
                isFocused,
            } = this.state;
            
        const { loginGoogle } = this.props;
            
        // style 
        const subCont = {
            overflow: 'hidden',
            position: 'absolute',
            left: '640px',
            top: '0',
            width: '900px',
            height: '100%',
            paddingLeft: '260px',
            background: '#fff',
            transition: 'transform 1.2s ease-in-out'
        }

        const form_sign_up = Object.assign({},form, { transform: 'translate3d(-900px, 0, 0)' }),
        form_login = Object.assign({},form, { transition: 'transform 1.2s ease-out' });

        if (page_status) {
            
            subCont['transform'] = 'translate3d(-640px, 0, 0)';
            
            form_login['transition'] = 'transform 1s ease-in-out';
            form_login['transform'] = 'translate3d(640px, 0, 0)';
            
            form_sign_up['transform'] = 'translate3d(0, 0, 0)';
            
        }

        const { onSubmit, onChange, checkIfUserExists,hoverFuncForPassword, dismissPopup } = this; 
        const signupProps = {   form_sign_up, 
                                header_style, 
                                username, 
                                email, 
                                password, 
                                psConfirm, 
                                errors,
                                isFocused,
                                onChange,
                                checkIfUserExists,
                                onSubmit,
                                loginGoogle,
                                hoverFuncForPassword,
                                dismissPopup,
                                isValid,
        };
        
        const login_errors = {
            padding:'4%',
            color:'red',
            fontSize: '1.2em',
            textAlign:'center'
        };

        return (
            <div style = { body }>
                <div style = { cont }>
                    <div style = { form_login }>
                        <h2 style = { header_style } >Welcome back!</h2>
                        <FormField  field = 'email_login' 
                                    value = { email_login } 
                                    error = {errors.email_login}
                                    isFocused = {isFocused.email_login}
                                    onChange = { this.onChange }
                                    checkUserExists = { this.checkIfUserExists }
                        />
                        <FormField  field = 'password_login' 
                                    value = { password_login } 
                                    error = {errors.password_login}
                                    isFocused = {isFocused.password_login}
                                    onChange = { this.onChange }
                                    checkUserExists = { this.checkIfUserExists }
                        />
                        <FormButton id = 'login' onSubmit = { this.login } isValid = {isValid} />
                        <FormButton id = 'google_login' onSubmit = { loginGoogle }/>
                    
                        <div style = {login_errors}>{ errors.login }</div>
                    </div>
                    
                    <div style = { subCont } >
                        <SingupLoginImg header_style = { header_style } 
                                        signup = { page_status } 
                                        change_page = { this.change_page }
                            />
                        <SignUpForm { ...signupProps } />

                    </div>
                </div>
                { this.state.showPopup && <Popup /> }

            </div>
    )}
}

const { func, object, bool } = PropTypes;

SignupPage.propTypes = {
    signUpRequest: func.isRequired,
    addFlashMessages: func.isRequired,
    isAuthenticated: bool,
    errors: object
};

const mapDispatchToProps = dispatch => ({
   signUpRequest : userData => dispatch({ type: 'SIGN_UP', userData }),
   addFlashMessages : message => dispatch({ type: 'ADD_FLASH_MESSAGE', message}),
   doesUserExist : userData => dispatch({ type: 'DOES_USER_EXIST', userData }),
   login: userData => dispatch({ type: 'LOGIN', userData }),
   loginGoogle: () => dispatch({ type: 'LOGIN_GOOGLE' })
});

const mapStateToProps = ({ auth }) => ({
    isAuthenticated: auth.isAuthenticated,
    errors: auth.errors 
});

export default connect( mapStateToProps, mapDispatchToProps )(withRouter(SignupPage));
