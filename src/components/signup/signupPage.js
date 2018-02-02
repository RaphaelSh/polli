import React from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TextField from '../../common/textFormField';
import { doesUserExist, signUpRequest } from '../../actions/signup';
import { addFlashMessages } from '../../actions/addFlashMessages';
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
            isLoading: false,
            isValid:true
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.checkIfUserExists = this.checkIfUserExists.bind(this);

    }
    
    onChange (e) {
        this.setState({[e.target.name]: e.target.value}); 
       // let errors = this.state.errors;
        //errors[e.target.name] = '';
      //  this.setState( {errors:{}});
    } 


    isValid(data) {
        const { errors, isValid } = validateInput(data);
        if(!isValid) { this.setState ({ errors })}
        return isValid;
    }
    
    onSubmit (e) {
       e.preventDefault();
       const {username, email, password, psConfirm} = this.state;
       
       if(this.isValid({username, email, password, psConfirm})){

           this.setState({ errors: {}, isLoading:true });
           
           this.props.signUpRequest({ username, email, password, psConfirm }).then(
              
             (data) =>{
                 console.log('our data has arrived! lets see whats in it: ',data);
                 this.props.addFlashMessages({
                    type: 'success',
                    text: "Welcome "+username+"!"
                 });
                 this.props.history.push('/');
             }, 
             (err) => err.response.json().then(errors=>{
                         this.setState({ errors: errors, isLoading:false});  
             })
           );
       }

    }
    
    checkIfUserExists (e) {
        let field = e.target.name; //username or email
        let val = e.target.value;
        if(val !== '') {
            let errors = this.state.errors, isValid;
        
            this.props.doesUserExist(val)
            .then( ({ data }) => {
                  if( data ) {
                      errors[field] = "There is already another member with that "+field+"."; 
                      isValid = false;    
                  }
                  else {
                      errors[field] = '';
                      isValid = true;
                      
                  }
                  this.setState({errors, isValid});
            });
        }
    }
    
        render(){
           const { errors, username, email, password, psConfirm,isValid, isLoading } = this.state;
           
           return (
               
               <div className = "ui two column centered grid">
                    <div className = "row" />
                    <div className = "row" />

               <form className = { classnames("ui","form","column",{loading:!!this.state.isLoading}) } onSubmit = {this.onSubmit}>
                <h1 className = "ui header blue">Sign up and create your own polls!</h1>
                
                <TextField 
                        error = {errors.username}
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
                <button className="ui blue basic button" tabIndex="0" disabled = {!isValid || isLoading}>Submit</button>
               </form>
               </div>
            );
            
        }
}

SignupPage.propTypes = {
    signUpRequest: PropTypes.func.isRequired,
    addFlashMessages: PropTypes.func.isRequired
};

export default connect((state) => { return {} },{ signUpRequest, addFlashMessages, doesUserExist })(withRouter(SignupPage));
