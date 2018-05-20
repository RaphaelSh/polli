import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../common/elements/formField';
import FormButton from '../../common/elements/formButton';


class SignUpForm extends React.Component {
        
        
        render(){
            const { form_sign_up, 
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
            } = this.props;
            
            const error_messege = {
                textAlign:'center',
                padding:'4%',
                color:'orange'
            };
            
            return (
                <div style = { form_sign_up } >
                    <h2 style = { header_style }>Just a little step from home</h2>
                    <FormField  field = 'username' 
                            value = { username } 
                            error = { errors.username }
                            isFocused = { isFocused.username}
                            onChange = { onChange }
                            checkUserExists = { checkIfUserExists }
                    />
                    <FormField  field = 'email' 
                            value = { email } 
                            error = { errors.email }
                            isFocused = { isFocused.email}
                            onChange = { onChange }
                            checkUserExists = { checkIfUserExists }
                    />
                    
                    <FormField  field = 'password' 
                                            value = { password } 
                                            error = { errors.password }
                                            isFocused = { isFocused.password}
                                            onChange = { onChange }
                                            checkUserExists = { checkIfUserExists }
                                            passwordChecker = { errors.passwordChecker }
                                            hoverFunc = { hoverFuncForPassword }
                                            dismissPopup = {dismissPopup}
                                />  
                      
                    <FormField  field = 'psConfirm' 
                            value = { psConfirm } 
                            error = { errors.psConfirm }
                            isFocused = { isFocused.psConfirm }
                            onChange = { onChange }
                            checkUserExists = { checkIfUserExists }
                    />
                    <FormButton id = 'signup' onSubmit = { onSubmit } isValid = {isValid} />
                    <FormButton id = 'google_signup' onSubmit = { loginGoogle }/>
                    <div style={error_messege}>{errors.passwordCheckerNameEmail}</div>

                </div>
                );
        }
        
}

const { func, string, object } = PropTypes;

SignUpForm.propTypes = {
    form_sign_up: object, 
    header_style: object, 
    username: string.isRequired, 
    email: string.isRequired, 
    password: string.isRequired, 
    psConfirm : string.isRequired, 
    errors: object.isRequired,
    isFocused: object,
    onChange:func.isRequired, 
    checkIfUserExists:func,
    onSubmit: func,
    loginGoogl: func
}

export default SignUpForm;