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
        
       Object.keys(data).forEach((item) => {
           if(isEmpty(data[item])){
              errors[item] = "This field is required";
           }
       });
       
       if(data.email && !Validator.isEmail(data.email)) {
         errors.email = 'Email is invalid';
       }
      
      if(data.psConfirm && !Validator.equals(data.password,data.psConfirm)) {
        errors.psConfirm = 'Passwords must match';
      }
        
      return {
        errors,
        isValid: isEmpty(errors)
      }
}