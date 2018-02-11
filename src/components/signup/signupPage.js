import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import { Form, Grid, Segment } from 'semantic-ui-react';

import TextField from '../../common/elements/textFormField';

import { validateInput } from '../../common/functions/signup';



class SignupPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            
            username: '',
            email: '',
            password: '',
            psConfirm: '',
            
            errors: {},
            isValid:true,
            
            isLoading: false,
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.checkIfUserExists = this.checkIfUserExists.bind(this);

    }
    
    onChange (e) {
        this.setState({[e.target.name]: e.target.value}); 
    } 


    isValid(data) {
        const { errors, isValid } = validateInput(data);
        if(!isValid) { this.setState ({ errors })}
        return isValid;
    }
    
    componentWillReceiveProps ( nextProps ) {
        // errors 
        const { state } = this;
        let finalErrors = state.errors, isValid, { errors } = nextProps;
        finalErrors = Object.assign( {}, finalErrors, errors );
        isValid = finalErrors === {} || !(_.findKey( finalErrors, (o) => o !== '' ));
        
        // signup was successfull
        if( isValid && this.props.isAuthenticated !== nextProps.isAuthenticated ) { 

            this.props.addFlashMessages({
                    type: 'success',
                    text: "Welcome "+this.state.username+"!"
            });
            this.props.history.push('/');
            return;
        }
        
        this.setState({ errors: finalErrors , isValid });
    }
    
    
    onSubmit (e) {
       e.preventDefault();
       const { username, email, password, psConfirm} = this.state;
       if(this.isValid({ username, email, password, psConfirm })){
           this.setState({ errors: {}, isLoading:true });
           this.props.signUpRequest({ username, email, password, psConfirm });
       }

    }
    
    checkIfUserExists (e) {
        const { name, value } = e.target;
        this.setState({ typedField: name }); //username or email
        if(value !== '') this.props.doesUserExist ( { name, value });
    }
    
    
        render(){
           const { errors, username, email, password, psConfirm,isValid, isLoading } = this.state;
           console.log('errors: ',errors, isValid);
           return (
               <Grid centered style={{height:'100vh',width:'100vw'}} verticalAlign='middle' className = 'login-container'>
                    <Grid.Column width={6} >
                        <Segment padded raised>
                            <Grid verticalAlign = 'middle' container style = {{ height : '90vh'}}>
                                <Grid.Column style={{
                                                textAlign : 'center'
                                }}>
                                    <Form className = { classnames({loading:!!this.state.isLoading}) } onSubmit = {this.onSubmit}>
                                        <h1 className = "ui header brown">Sign up and create your own polls!</h1>
                                        
                                        <TextField 
                                                error = { errors.username }
                                                label = 'Username'
                                                onChange = { this.onChange }
                                                value = { username }
                                                type = 'text'
                                                field = 'username'
                                                name = 'username'
                                                checkUserExists = {this.checkIfUserExists}
                                        />
                                        <TextField 
                                                error = {errors.email}
                                                label = 'Email'
                                                onChange = { this.onChange }
                                                value = { email }
                                                type = 'text'
                                                field = 'email'
                                                name = 'email'
                                                checkUserExists = {this.checkIfUserExists}
                        
                                        />
                                        <TextField 
                                                error = {errors.password}
                                                label = 'Password'
                                                onChange = { this.onChange }
                                                value = { password }
                                                type = 'password'
                                                field = 'password'
                                                name = 'password'
                        
                                        />
                                        <TextField 
                                                error = {errors.psConfirm}
                                                label = 'Password Confirmation'
                                                onChange = { this.onChange }
                                                value = { psConfirm }
                                                type = 'password'
                                                field = 'psConfirm'
                                                name = 'psConfirm'
                        
                                        />
                                        <button className="ui brown basic button" tabIndex="0" disabled = {!isValid || isLoading}>Submit</button>
                                    </Form>
                                </Grid.Column>
                            </Grid>
                        </Segment>
                    </Grid.Column>
               </Grid>
            );
            
        }
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
   doesUserExist : userData => dispatch({ type: 'DOES_USER_EXIST', userData })
});

const mapStateToProps = ({ auth }) => ({
    isAuthenticated: auth.isAuthenticated,
    errors: auth.errors 
});

export default connect( mapStateToProps, mapDispatchToProps )(withRouter(SignupPage));
