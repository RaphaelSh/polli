import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import TextField from '../../common/textFormField';
import { validateInput } from '../../common/functions/signup';
import { login } from '../../actions/signup';



class LoginPage extends Component {
        constructor(props) {
            super(props);
            this.state = {
                identifier: '',
                password: '',
                errors :{},
                isLoading: false
            }
            this.onChange = this.onChange.bind(this);
            this.onSubmit =  this.onSubmit.bind(this);
            this.closeMessage =  this.closeMessage.bind(this);
            
        }
        
        onChange (e) {
            if(!this.state.errors.form){
                this.setState({ errors:{}});
            }
            this.setState({[e.target.name]: e.target.value });
        }
    
        isValid(data) {
            const { errors, isValid } = validateInput(data);
            if(!isValid) { this.setState ({ errors })}
            return isValid;
        }
        
        closeMessage (e) {
            console.log("asd");
            this.setState({errors:{}});
        }
        
        onSubmit (e) {
           e.preventDefault();
           const {identifier, password} = this.state;
           if(this.isValid({ identifier, password })) {
                this.setState({ errors: {}, isLoading: true});
                this.props.login(this.state).then(
                    res => this.props.history.push('/'),
                    err => this.setState({ errors: err , isLoading:false})  
                );
           }
        }
        
        render(){
            const {identifier, errors, password, isLoading } = this.state;
            return(
                <div className = "ui four column grid ">
                    <div className = "row" />
                    
                    { errors.form ? 
                        (<div className="ui warning message container grid right aligned">
                            <div className="ui header row">
                                
                                <div className = "center aligned twelve wide column">
                                    {errors.form}
                                </div> 
                                <div className="right aligned two wide column">
                                        <i className="ui close icon " onClick ={ this.closeMessage }></i>
                                </div>
                            </div>
                            <div className ="row centered">
                                Please visit our registration page and then try again
                            </div>
                        </div>):
                        (<div className = "row" />)
                    }
                    
                    <form onSubmit = { this.onSubmit } className = { classnames("ui","centered","form","segment","padded","raised","eight","wide","column",{loading:!!isLoading}) }>
                        <TextField 
                            propsClass = "ui blue header"
                            field = 'identifier'
                            label = 'Username/Email'
                            value = { identifier }
                            error = { errors.identifier }
                            onChange = { this.onChange }
                        />
                        <TextField 
                            propsClass = "ui blue header"
                            field = 'password'
                            label = 'Password'
                            value = { password }
                            error = { errors.password }
                            onChange = { this.onChange }
                            type = 'password'
                        />
                        <div className="ui two column centered grid padded">
                            <button className="ui blue basic button" tabIndex="0" disabled = {isLoading } >Submit</button>
                        </div>
                    </form>
                </div>
            );
        }
}

LoginPage.propTypes = {
    login: PropTypes.func.isRequired
};

export default connect(null,{login})(withRouter(LoginPage));