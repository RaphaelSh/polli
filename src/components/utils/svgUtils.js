const d3 = {...require('d3-path')};

const path = require("svg-path-properties");

export const getPathLength = points => {
    let p = d3.path();
            points.forEach((point, i) => {
                let [ d0, d1 ] = points[i];
                
                if( i === 0 ) {
                    p.moveTo( d0, d1 ); return;
                }
                
                if( i === (points.length - 1)) {
                   p.lineTo( d0, d1 ); p.closePath(); return;  
                }
                
                p.lineTo( d0, d1 );
                
            });
            
            const properties = path.svgPathProperties(p.toString());
            return properties.getTotalLength();  
};