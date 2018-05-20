import React, {Component} from 'react';
import PropTypes from 'prop-types';

const { string, number,arrayOf, shape } = PropTypes;


export default class Text extends Component {
    
   
    onmouseover () {
        const { mouseover, i } = this.props;
        mouseover(i);
    } 


    render () {
        const { height, width, points, option,votes, color,sum, tooltip } = this.props,
        { pos, align } = points, text_width = 0.18*width, [pos0,pos1] = pos,
        left = align ==='left' ? pos0 : pos0 - text_width;
        const percenage = Math.round((votes/sum)*100);

        const text = {
                backgroundColor: color,
                color:'#eee',
                fontSize : '18px',
                padding: '.5em',
                lineHeight:'20px'

        };
        const big_div = {
                position:'absolute',
                top : `${height/2}px`,
                left : `${width/2}px`,
                width : `${text_width}px`, 
                transform : `translate(${left}px,${pos1}px)`,
                textAlign : 'center',
                textOverflow:'ellipsis',
                fontFamily: 'EB Garamond'
        };
        const tooltip_style = {
            color:'#444',
            transition:'.2s',
            padding: '.5em'
        }
                        
        return  <div style = {big_div} >
                    <div className='texts' style = { text } 
                        onMouseOver = { this.onmouseover.bind(this) } 
                        onMouseOut = { this.props.mouseout }
                    >
                        { option }
                    </div>
                    { tooltip && 
                        <p style = { tooltip_style }> 
                            {`Votes: ${votes}`}<br/>
                            {`Ratio: ${percenage}%`} 
                        </p> 
                    }
                </div>;
        
                
    }
}

Text.propTypes = {
    option: string,
    height: number, 
    width: number, 
    points: shape({
        align: string,
        pos: arrayOf( number) 
    }) 
};