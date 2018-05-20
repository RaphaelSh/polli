

const d3 = {
  ...require('d3-scale'),
  ...require('d3-selection'),
  ...require('d3-transition'),
  ...require('d3-shape'),
  ...require('d3-interpolate'),
  ...require('d3-ease'),
};

export default ( lines, line_pos, color, mode ) => {
        
    const lineGen = d3.line().x(d =>d[0]).y(d =>d[1]);
                    
    function tweenDash (d) {
                
        const l = d.path_length, dashing = "5, 5",

        dashLength = dashing.split(/[\s,]/)
                            		.map( a => parseFloat(a) || 0 )
                            		.reduce( (a, b) => a + b ),
        		
        dashCount = Math.ceil( l / dashLength ),
        newDashes = new Array(dashCount).join( dashing + " " ),
        dashArray = newDashes + " 0, " + l,
        i = d3.interpolateString("0," + l, dashArray);
        return function(t) { return i(t); };
    }
    
    const path = mode ==='render' ? lines.enter().append('path') : 
                                        lines.enter().selectAll('path').data(line_pos)
    
    path.attr("fill", "none")
        .attr("stroke",(d,i)=> color(i))
        .attr('d', d => lineGen(d.pos))       
        .attr('class','paths')  
        .attr('class','paths')  
        .transition()
            .ease(d3.easeLinear)
            .duration(750)
            .attrTween("stroke-dasharray", tweenDash)
};

