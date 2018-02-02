 
import React from 'react';
import PropTypes from 'prop-types';
import { withFauxDOM } from 'react-faux-dom';
import _ from 'lodash';

import Tooltip from './toolTip';
import Question from './question'

const d3 = {
  ...require('d3-scale'),
  ...require('d3-selection'),
  ...require('d3-transition'),
  ...require('d3-shape'),
  ...require('d3-interpolate'),
  ...require('d3-ease')
},

{ arrayOf, string, number, shape } = PropTypes;
 
class PieChart extends React.Component {
    
    state = { tooltip:null, animationOver: false }
    
    computeTooltipProps = () => {
        
        const   { width, height, options } = this.props,
                { votes, pos, dir } = this.state.tooltip, [ x, y ] = pos,
                percenage = Math.round((+votes/_.sumBy( options,'votes')) * 100);
        return { style: {
                  top : height/2 + y + 0.01*height,
                  left : dir ==='start'? width * 0.5 + x + 0.02 * width : width * 0.5 + x - 0.19 * width 
                },
                content: `Number of votes: ${votes}`,
                extra: `Ratio in percetege: ${percenage}%`
            };
    }
    
    setHover(d){

        if (d) {
                const { data, textPos, textAnchor } = d;
                        this.setState({ tooltip: {
                                            votes: data.votes,
                                            pos: textPos,
                                            dir: textAnchor
                                          }
                        });    
        }
        else this.setState({ tooltip:null });
    }
    
    hover = (component) =>{ 
        component.on('mouseover', (d,i) =>{
            component.style('cursor','pointer');
            clearTimeout(component.unsetHoverTimeout);
            this.setHover(d);
        }).on('mouseout', d => 
            component.unsetHoverTimeout = setTimeout(() =>this.setHover(null) , 200)
        );
    }
    
    componentDidMount(){
        
        // the faux div stored in its virtual DOM in state.chart
        const{ options, width, height, connectFauxDOM, animateFauxDOM } = this.props, 
        faux = connectFauxDOM('div', 'chart'),

        color = d3.scaleLinear().domain([1, 10]).range(['#99707A','#FFCABC']),
        data = _.cloneDeep(options), // pie() mutates data
        
        /* ------------ pie chart ------------*/
        
        radius = height / 2.5,
        
        arc = d3.arc()
            .innerRadius(radius*0.6)
            .outerRadius(radius*0.8)
            .cornerRadius(3)
            .padAngle(0.02),
        
        labelArc = d3.arc().innerRadius(radius*0.9).outerRadius(radius*0.9),
        midAngle = d => d.startAngle + (d.endAngle - d.startAngle) / 2,
        pie = d3.pie().value(d => d.votes+1),
    
        svg = d3.select( faux )
            .append('svg')
            .attr('width', width)
            .attr('height', height),
    
        slices = svg.append('g')
            .attr('transform', `translate(${width/2}, ${height/2})`)
            .attr('class','slices'),
       
        arcs = slices.selectAll('g.slices').data(pie(data));
    
        /* slices and texts */
        
        function arcTween(d) {
            d.innerRadius = 0;
            var i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return t => arc(i(t));
        };
        
        let slicesEnter = arcs.enter().append('path');
                   
        slicesEnter.transition()
                    .duration(2000)
                    .ease(d3.easeBounce)
                    .attrTween('d',arcTween)
                    .style('fill', (d, i) => color(i))    
        
        this.hover( slicesEnter ); 
                            
       
    // --------------------- texts  --------------------- 
        const enterQuestion = () => {
            
            const line = d3.line().x( d => d[0] ).y( d => d[1]),
            path = arcs.enter().append('path')
                            .attr("fill", "none")     // remove fill colour
                            .attr("stroke","#ADADAE")
                            .style("stroke-dasharray",'5,5');

            path.attr('d',function (d) {
                let pos = labelArc.centroid(d);
                pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                let lines = [arc.centroid(d), labelArc.centroid(d), pos];
                return line(lines);
            });
            
            this.setState({ animationOver:true });
        },
        
        
        textEnter = arcs.enter().append('text');
        textEnter.transition()
            .ease(d3.easeLinear)
            .duration(1000)
            .attr('transform', function (d,i) {
                d.textPos = labelArc.centroid(d);
                d.textPos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
                return `translate(${ d.textPos })`;
            })
            .style('text-anchor', d => d.textAnchor = midAngle(d) < Math.PI ? 'start' : 'end')         
            .style('font-size','1.2em')
            .style("text-shadow","0 0.1em .3em rgba(0, 0, 0, 0.15)")  // colour the line
            .style('fill', (d,i)=> color(i))
            .text(d => d.data.option.toUpperCase())
            .on('end',enterQuestion);
  
        this.hover(textEnter );
        
        animateFauxDOM(8000);
        
    }

 
    render() {
        
        let { chart, height, width, question } = this.props,
        { tooltip, animationOver } = this.state,
        style = { width, height, position : 'relative' };
        
        question = question.replace(/(^[a-z]?)/,( m, p ) => p.toUpperCase());
        const questionProps = { height, width, question };
        
        return (
            <div className = 'pieChart' style={ style }>
                { tooltip && <Tooltip {...this.computeTooltipProps()} /> }
                { animationOver && <Question  { ...questionProps } /> }
                { chart } 
            </div>
        );
    }
}



PieChart.propTypes = {
    question : string,
    owner : string,
    options : arrayOf( shape( { option: string, votes: number })),
    width : number,
    height : number
};
  
export default withFauxDOM(PieChart);


////////////////////////////////////////////////////////////////////////////////


