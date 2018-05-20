import { isEmpty } from 'lodash';
import Validator from 'validator';


export const handleResponse = (res) => {
  if(res.ok) return res.json();
  let error = new Error(res.statusText);
  error.response = res;
  throw error;
}

export const validateInput = (data) => {
    
    let errors = {};
        
    Object.keys(data).forEach((name) => {
        
        if ( isEmpty( data[name] )) { 
            let name_to_use = /psConfirm/g.test(name) ? 'password confirmation' : ( name.includes('_') ? name.split('_')[0] : name );
            name_to_use = name_to_use.replace(/(^[a-z]{1})/g,p=>p.toUpperCase());
            errors[name] = `${name_to_use} is required`; 
        }
        
        if( /email/g.test(name) && !Validator.isEmail(data[name]) ) {
            errors[name] = 'Email is invalid';
        }
      
        if( data.psConfirm && data.password && !Validator.equals(data.password,data.psConfirm )) {
            errors.psConfirm = 'Passwords must match';
        } 
    
    });
       
    return {
        errors,
        isValid: isEmpty(errors)
    }
}