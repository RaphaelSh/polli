 
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const {arrayOf, number, shape} = PropTypes;

class Path extends React.Component {
    
    render() {
        
        let { points } = this.props;
        let left = _.minBy(points,'x'), top = _.minBy(points,'y'),
        width = _.maxBy(points,'x').x-left.x,
        height = _.maxBy(points,'y').y-top.y;
        
        let d  = `M${left.x} ${left.y}`;
        
        for(let i = 1; i< points.length; ++i) {
            d+= ` L ${points[i].x} ${points[i].y}`
        }


        let style = { 
                    'width': width*2, 
                    'height': height*2,
                    'position':'absolute',
                    'left':left.x,
                    'top':top.y,
                    'border':'2px solid black'
        }
                

        return (
            <div style = { style }>
                <svg  width = { width*2 }  height = { height*2 }>
                    <path   d = {d} 
                            ref = { (ref) => {this.path = ref;} }
                            stroke="red"
                            strokeWidth="1" 
                            strokeDasharray="5,5" 
                            fill="none"
                    /> 
                </svg>
            </div>
        );
    }
}


Path.propTypes = {
   points:arrayOf(shape({ x: number, y: number}))
};

  
export default Path;


////////////////////////////////////////////////////////////////////////////////



