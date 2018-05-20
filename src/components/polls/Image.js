import React from 'react';

export default ({src}) => {
    
const circle = {
  width:'200px',
  height:'200px',
  borderRadius:'50%',
  background: `url(${src}) center`,
  backgroundSize:'cover',
  margin:'10% auto',
  zIndex:'999',
  filter: 'greyscale(80%)'
};

return <div style = {circle}></div>
};