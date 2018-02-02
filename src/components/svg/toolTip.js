import React from 'react';
import PropTypes from 'prop-types';

const mystyles={
  'position':'absolute',
  'overflow':'scroll',
  'border':'2px solid #ddd',
  textAlign:'center',
  color:'#777',
  width:'17%'
};

const Tooltip = ({style = {}, content, extra}) => {
  return (
          <div className='tooltip' style={{...mystyles, ...style }}>
            <p> {content} <br/> {extra} </p>
          </div>
)};

const {string, object} = PropTypes;

Tooltip.propTypes = {
  content: string,
  style: object
};

export default Tooltip;