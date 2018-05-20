import React from 'react';
import PropTypes from 'prop-types';

const FormButton = ({ id, onSubmit, isValid=true })  => {
        if(id === 'button-signup'){console.log(isValid);}
        const content = id => {
            let google = word => {
                const span = {
                    fontWeight: 'bold',
                    color: '#455a81'
                }            
                    
                return <div>`{word} with `<span style = { span } >Google</span></div>;
                
            }
            return {
                signup : 'Sign Up',
                login : 'Sign In',
                google_login:google('Connect'),
                google_signup: google('Join')
            }[id];
        }
        
        const basic_style = {
            border: 'none',
            outline: 'none',
            background: 'none',
            fontFamily: 'Abhaya Libre, Helvetica, Arial, sans-serif',
            display: 'block',
            margin: '0 auto',
            width: '260px',
            height: '36px',
            borderRadius: '30px',
            color: '#fff',
            fontSize: '15px',
            cursor: isValid?'pointer':'not-allowed'
        }
        
        const button_google = {
            border: '2px solid #d3dae9',
            color: '#8fa1c7'
        }
        const button_submit = {
            marginTop: '40px',
            marginBottom: '20px',
            background: '#bfa590',
            textTransform: 'uppercase'
        };
        
        const style = Object.assign({},basic_style,['signup','login'].includes(id)?button_submit:button_google);
        return  <button type='submit' style={ style } onClick = {onSubmit} disabled = { !isValid } >{ content(id) }</button>;
            
}

const { string, func, bool } = PropTypes;
FormButton.propTypes = {
    id : string.isRequired,
    onSubmit: func,
    isValid: bool
};

export default FormButton;



