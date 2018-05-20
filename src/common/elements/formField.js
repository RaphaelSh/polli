import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react'

class FormField extends React.Component { 
    
    constructor(props) {
        super(props);
        const { field } = props;
        this.state = {
           password_or_text: ['password','psConfirm','password_login'].includes(field),
           showPopup: false
        }
    }

    iconClick () { this.setState({ password_or_text:!this.state.password_or_text })}
    
    render () {
        const { field, 
                value, 
                error, 
                isFocused, 
                onChange, 
                checkUserExists,
                passwordChecker,
                hoverFunc,
                dismissPopup
            } = this.props;
    
        const { password_or_text } = this.state,
            type = password_or_text ? 'password':'text', 
            icon_name = password_or_text? 'unhide':'lock',
            passwordChecker_props = passwordChecker ? [ { color: 'brown', text: 'poor' },
                                                        { color: 'orange', text: 'weak' },
                                                        { color: '#AfA', text: 'good' },
                                                        { color: 'green', text: 'excellent' }
                                                      ][ passwordChecker / 25 - 1 ]: passwordChecker === 0 ?
                                                    { color: 'red', text: 'bad' }:{ color: '', text: '' }

        
        
        let label = (field ==='psConfirm' ? 'password confirmation' : 
                        (['email_login','password_login'].includes(field) ? field.split('_')[0] : field ))
                        .toUpperCase();
        

        const div = {
            position:'relative',
            display:'block',
            width: '280px',
            margin: '25px auto 0',
        }
        const container_style =  {
              display: 'block',
              position:'relative',
        };
            
        const label_basic = {
            zIndex:'1',
            outline: 'none',
            display: 'inline-block',
            fontSize: '16px',
            color: '#afafaf',
            position: 'absolute',
            whiteSpace: 'nowrap',
            top:'0px',
            left:'50%',
            transform: 'translateX(-50%)',
            transition: '.5s all cubic-bezier(0.2, 0, 0.03, 1)',
            cursor :'text'
            
        };
        
        const label_style = isFocused ? Object.assign({}, label_basic, {
            fontSize: '12px',
            left:'0px',
            transform:'translate(0%, -10px)',
        }) : label_basic;
        
            
        const input  = {
            border: 'none',
            outline: 'none',
            fontFamily: 'Abhaya Libre',
            display: 'block',
            width: '100%',
            marginTop: '5px',
            paddingBottom: '5px',
            fontSize: '16px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.4)',
            textAlign: 'center',
        };
        
        const line_style = {
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: `${passwordChecker}%`,
            height: '2px',
            backgroundColor: passwordChecker_props.color,
            transition: '0.4s'
        }
        
        const icon = {
            position:'absolute',
            left:'105%',
            cursor: 'pointer'
        }
        
        const passwordCheckerStyle = {
            position:'absolute',
            left:'-100px',
            color: passwordChecker_props.color,
            fontFamily:'Raleway',

        }
        return  (   <div style={div}>
                    { ['password','psConfirm','password_login'].includes(field) 
                        && <Icon inverted 
                                color='grey' 
                                name = {icon_name} 
                                style={ icon }                                                    
                                size='large'
                                onClick = { this.iconClick.bind(this) }
                            />
                    }
                    { ['password','psConfirm','password_login'].includes(field) 
                        && <span style={ passwordCheckerStyle }>{passwordChecker_props.text}</span>
                        }
                        <label style = { container_style } 
                                onMouseEnter = { hoverFunc }
                                onMouseLeave = { dismissPopup }
                        >
                        <span  style = { label_style }>{ label }</span>
                        <input  type= { type } 
                                name = { field }
                                value = { value }
                                onChange = { onChange }
                                onFocus = { onChange }
                                onBlur = { checkUserExists }
                                style = { input }
                        />
                        <i style={ line_style } />
                        
                        { error && <span>{error}</span> }

                    </label>
                </div>
            );
    }
}


const { bool, string, func } = PropTypes;
FormField.propTypes = {
    field: string.isRequired,
    value: string.isRequired,
    error: string,
    isFocused: bool,

    onChange: func.isRequired,
    checkUserExists: func,
};


export default FormField;
