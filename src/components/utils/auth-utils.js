
const base64 = require('base64-js');

// Based on https://github.com/tastejs/todomvc/blob/gh-pages/examples/react/js/utils.js



// Based on auth0 /src/helper/Base64-url
  
function stringToByteArray(str) {
  var arr = new Array(str.length);
  for (var a = 0; a < str.length; a++) {
      arr[a] = str.charCodeAt(a);
  }
  return arr;
}

export const encode = (str) => {
    return base64
      .fromByteArray(stringToByteArray(str))
      .replace(/\+/g, '-') // Convert '+' to '-'
        .replace(/\//g, '_'); // Convert '/' to '_'
  }
  
function padding(str) {
  var mod = str.length % 4;
  var pad = 4 - mod;

  if (mod === 0) {
    return str;
  }

  return str + new Array(1 + pad).join('=');
}

function byteArrayToString(array) {
  var result = '';
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i]);
  }
  return result;
}

export const decode = (str) => {
  str = padding(str)
    .replace(/-/g, '+') // Convert '-' to '+'
    .replace(/_/g, '/'); // Convert '_' to '/'

  return byteArrayToString(base64.toByteArray(str));
};


export const password_chracterists = {
  password_length: 8,
  types_length: 3,
  types: [/[A-Z]/g,/[a-z]/g,/[0-9]/g,/[!@#$%^&*]/g]
};

export const passwordCheckerNameEmail = (password, name, email ) => {
  email = email.split('@')[0].toLowerCase();
  name = name.toLowerCase(); 
  password = password.toLowerCase();
  return (email && password.includes(email)) || (name && password.includes(name));
};

export const passwordChecker = ( password, name, email ) => {
// success is when 4 demands are answered
  const success_types_length = 3, password_max_length = 8;
  
  let success = 0, types = [/[A-Z]/g,/[a-z]/g,/[0-9]/g,/[!@#$%^&*]/g];
  
  while ( success < success_types_length && types.length ) {
    if( types.shift().test(password) ) { success++; }
  }
  
  if ( password.length >= password_max_length ) { success++; }
  if( passwordCheckerNameEmail( password, name, email ) ) { success--; }
  
  return success*25;
};


