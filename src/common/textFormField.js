import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class  TextFieldGroup extends React.Component {
        constructor(props){
            super(props);
            this.state = {
                iconVisible:false
            }
            this.iconHoverFunc = this.iconHoverFunc.bind(this);

        }
        
        iconHoverFunc(e) {
           this.setState({iconVisible:!this.state.iconVisible});
        }
       
        
        render() {
        const { field, value, label, error, type, onChange, checkUserExists, propsClass, placeholder, addIcon, iconClickFunc, index } = this.props;
        const { iconVisible } = this.state;
        
        const input_field = (
              <input type={ type } 
                            name = { field }
                            value = {value}
                            onChange = {onChange}
                            onFocus = {onChange}
                            onBlur = { checkUserExists }
                            placeholder = { placeholder }
                            data-index = {index}
                 /> 
        );
        
        const basic_field = (
            <div className = "container">
                <label className = { propsClass }>{ label }</label>
                {input_field}
                { error && <span>{error}</span> }
            </div>
            );
        
        const icon_field = (
                <div className = 'inline fields'  onMouseEnter = {this.iconHoverFunc} 
                                                  onMouseLeave = {this.iconHoverFunc}
                                                  onClick = { iconClickFunc }
                                                  data-index = {index}
                                                  >
                     
                    <label className = { "three wide field padded "+propsClass }  >{ label }</label>

                    <div className=" thirteen wide field"> { input_field } </div>
                    { iconVisible && <i className="ui close icon red" style={{'cursor':'pointer'}}> </i> }
                    { error && <span>{error}</span> }
                </div>
            );

        return  ( <div className = {classnames('field',{ 'error':error })}>
                    { addIcon ? icon_field : basic_field }
                  </div>
                );
            
    }
}

TextFieldGroup.propTypes = {
    field: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    type:  PropTypes.string.isRequired,
    
    onChange: PropTypes.func.isRequired,
    checkUserExists: PropTypes.func,
    
    propsClass: PropTypes.string,
    placeholder: PropTypes.string,
    
    addIcon: PropTypes.bool
}

TextFieldGroup.defaultProps = {
    type: 'text'
}

export default TextFieldGroup;