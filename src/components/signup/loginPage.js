import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Grid, Button, Form, Segment, Icon, Message } from 'semantic-ui-react';

import TextField from '../../common/elements/textFormField';
import { validateInput } from '../../common/functions/signup';


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
            if(!this.state.errors) this.setState({ errors:{}});
            this.setState({ [e.target.name] : e.target.value });
        }
    
        isValid(data) {
            const { errors, isValid } = validateInput(data);
            if(!isValid) { this.setState ({ errors })}
            return isValid;
        }
        
        closeMessage (e) { 
            this.setState({ errors:{} });
        }
        
        onSubmit (e) {
            e.preventDefault();
            const {identifier, password} = this.state;
            if ( this.isValid({ identifier, password })) {
                this.setState({ errors: {}, isLoading: true});
                this.props.login({ identifier, password });
            }
            else {
                let errors = Object.assign({},this.state.errors, { form: 'One or more of the details you provided was incorrect. Please try agian.'});                
                this.setState({ errors});
            }
        }
        
        componentWillReceiveProps ( nextProps ) {
            if(nextProps.errors ==='Invalid Credentials') {
                let errors = Object.assign({},this.state.errors, { form: 'One or more of the details you provided was incorrect. Please try agian.'});                
                this.setState({ errors, isLoading:false});
            }
            else this.props.history.push('/');
        }
        
        
        render(){
            const {identifier, errors, password, isLoading } = this.state;
            console.log('errors: ',isLoading);
            return(
                
                
                <Grid centered container 
                        className = {classnames({'loading':!!isLoading},'login-container')}
                        style={{width: '100vw !important'}}
                >
                
                <Grid.Column width = {6}>
                   
                    <Segment padded raised>
                        <Grid container style = {{ height : '90vh'}}>
                            <Grid.Row  className = 'loginMessage'>
                                { errors.form && 
                                    <Message warning >
                                        <Icon name='close' onClick ={ this.closeMessage }></Icon>
                                        <Message.Header>Invalid credentials</Message.Header>
                                        <p> { errors.form } </p>
                                    </Message> 
                                }
                            </Grid.Row> 
                            
                            <Grid.Row centered className = 'loginForm'>
                            <Form padded onSubmit = { this.onSubmit } >
                                 
                                <TextField 
                                    propsClass = "ui brown header"
                                    field = 'identifier'
                                    label = 'Username/Email'
                                    value = { identifier }
                                    onChange = { this.onChange }
                                />
                                <TextField 
                                    propsClass = "ui brown header"
                                    field = 'password'
                                    label = 'Password'
                                    value = { password }
                                    onChange = { this.onChange }
                                    type = 'password'
                                />
                            <Grid.Row width={2} padded>
                                <Button basic color='brown' tabIndex="0" disabled = {!!isLoading || errors.form } >Submit</Button>
                            </Grid.Row>
                        </Form>
                        </Grid.Row>
                         <Grid.Row/>
                </Grid>
                </Segment>
                
                </Grid.Column>
            </Grid>
            );
        }
}

const { func, bool, string } = PropTypes;

LoginPage.propTypes = {
    login: func.isRequired,
    isAuthenticated: bool.isRequired,
    errors: string
};

const mapStateToProps = ({ auth }) => ({
    isAuthenticated: auth.isAuthenticated,
    errors: auth.errors
})

const mapDispatchToProps = dispatch => ({
    login : userData => dispatch({ type: 'LOGIN', userData })
})

export default connect( mapStateToProps, mapDispatchToProps )(withRouter(LoginPage));