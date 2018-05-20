 
import React from 'react';
import PropTypes from 'prop-types';
import { withFauxDOM } from 'react-faux-dom';
import _ from 'lodash';

import Question from './question';
import Text from './texts';
import shallowEqual from '../utils/shallowEqual';

import renderLine from './renderLine';
import { getPathLength } from '../utils/svgUtils';

const d3 = {
  ...require('d3-scale'),
  ...require('d3-selection'),
  ...require('d3-transition'),
  ...require('d3-shape'),
  ...require('d3-interpolate'),
  ...require('d3-ease')
},

{ arrayOf, string, number, shape } = PropTypes;


const pie = d3.pie().value(d => d.votes+1);

 
class PieChart extends React.Component {
    
    constructor (props) {
        super(props);
        
        this.state = {  tooltip:null, 
                        animationOver: false, 
                        text_data:[], 
                        line_pos:[], 
                        mode : 'render',
                        sum:0
        }
        
        this.setHover = this.setHover.bind(this);
        this.hover = this.hover.bind(this);
        this.computeTextsPos = this.computeTextsPos.bind(this);
        this.mouseover = this.mouseover.bind(this);
        this.mouseout = this.mouseout.bind(this);
        this.computePos = this.computePos.bind(this);
    }
    
    
    setHover ( i ) {
        if (Number.isInteger(i)) { this.setState({ tooltip: i });}
        else { this.setState({ tooltip:null }); }
    }
    
    mouseover (i) {
        clearTimeout( this.unsetHoverTimeout );
        this.setHover (i);
    }
    
    mouseout () {
        this.unsetHoverTimeout = setTimeout( () => this.setHover(null) , 100 );
    }
    
    hover = component => component.on('mouseover', ( d, i ) => this.mouseover (i) )
                                    .on('mouseout', () => this.mouseout());
    
    computePos = ( d, i ) => {
            const pos = this.labelArc.centroid(d), { width } = this.props;
            pos[0] = ( 0.3 * width ) * ( this.midAngle(d) < Math.PI ? 1 : -1 );

            const data = {
                align : this.midAngle(d) < Math.PI ? 'left' : 'right',
                pos,
                votes : d.data.votes    
            };
            
            let lp = [ this.arc.centroid(d), this.labelArc.centroid(d), [ pos[0],pos[1]+1.5 ] ]; // added 1.5 for line's width 
            let { text_data, line_pos } = this.state;
            text_data.push(data); line_pos.push(lp);
            this.setState({ text_data, line_pos }, () => {

                if( i === this.props.options.length-1 ) { 
                    this.setState({ animationOver: true });
                    line_pos = line_pos.map( l => ({ pos: l, path_length: getPathLength(l)}));
                    let lines = this.state.mode ==='render' ? 
                                    this.svg.append('g').attr('class','lines'):
                                    this.svg.select('g.lines');

                    console.log('line_pos: ',line_pos)
                    lines = lines.selectAll("path.paths").data(line_pos);
                    
                    renderLine(lines, line_pos, this.color, this.state.mode);
                }
            });
    }
    
    computeTextsPos = (d, i) => {
        if (this.state.mode === 'render') {
            this.computePos(d, i);
            this.ds = this.ds || [];
            this.ds.push(d);
        }
        else { this.ds.forEach((d, i) => { this.computePos(d, i) }); }
    }
    
    pieChartD3 () {
        
        const { options, 
                width, 
                height, 
                connectFauxDOM, 
                animateFauxDOM 
        } = this.props,
        
        { mode } = this.state;
        
        const faux = connectFauxDOM( 'div', 'chart');

        this.color = d3.scaleLinear().domain([1, 10]).range(['#8d6560','#fdd5d0']);
        
        const data = _.map(options, _.clone);// pie() mutates data
        

        /* ------------ pie chart ------------*/
        
        this.radius = Math.min(height, width) / 2.5;
        
        this.arc = d3.arc ()
                    .innerRadius( this.radius * 0.6 )
                    .outerRadius( this.radius * 0.8 )
                    .cornerRadius( 3 )
                    .padAngle( 0.02 );
        
        const radiusLabel = this.radius * 0.9;
        this.labelArc = d3.arc().innerRadius(radiusLabel).outerRadius(radiusLabel);
        this.midAngle = d => d.startAngle + (d.endAngle - d.startAngle) / 2;
        
       // let svg;
        
        if (mode==='render') {
            this.svg = d3
                .select(faux)
                .append('svg')
                .attr('width', width)
                .attr('height', height)
                .append('g')
                .attr('transform', `translate( ${ width / 2 }, ${ height / 2 })`)
            } 
        else if (mode === 'resize') {
            this.svg = d3
                    .select(faux)
                    .select('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .select('g')
                    .attr('transform', `translate( ${ width / 2 }, ${ height / 2 })`);

        } else this.svg = d3.select(faux).select('svg').select('g');
       
        this.arcs = this.svg.selectAll('g.slices').attr('class','slices').data(pie(data))
        
// --------------- slices --------------- 
        

        const arcTween = d => {
            let i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
            return t => this.arc(i(t));
        };
       
        let slicesEnter = mode === 'render' ? this.arcs.enter().append('path') : 
                                                this.arcs.enter().selectAll('path');
        
        if( mode === 'render' ) {
            slicesEnter.style('fill', (d, i) => this.color(i))
                                        .transition()
                                        .duration(2000)
                                        .ease(d3.easeBounce)
                                        .attrTween('d',arcTween)
                                        .on('end', this.computeTextsPos);
        }
        
        else if ( mode === 'resize' ) {
                slicesEnter.attr('d',this.arc );
                this.computeTextsPos();
        }
        
       slicesEnter
                .attr('class','slicesEnter')
                .call(this.hover);

        animateFauxDOM(5000);
        
    }
    
    componentDidMount () {
        this.pieChartD3();
        this.setState({ sum: _.sumBy( this.props.options,'votes')});
    }
    
    componentDidUpdate ( nextProps ) {
        const shouldResize = props => _.pick(props, ['width','height']);
        if (!shallowEqual(shouldResize(this.props), shouldResize(nextProps))) {
            this.setState({ animationOver : false, mode : 'resize', text_data: [], line_pos:[] },()=> this.pieChartD3());
        }
    } 
    
    render() {
        
        let { text_data,tooltip,sum } = this.state, { chart, height, width, question, options } = this.props;
        const pie_style = { 
            width, 
            height,
            position: 'relative',
            display: 'inline-block'
        };
        
        question = question.replace(/(^[a-z]?)/,( m, p ) => p.toUpperCase());
        const questionProps = { height, width, question };
        
        
        let textProps = {   height, 
                            width,
                            setHover : this.setHover,
                            sum
        };

        return (
            <div className = 'pieChart' style = { pie_style }>
                { chart } 
                <Question  { ...questionProps } /> 
                {/* texts and lines */}
                { this.state.animationOver && 
                    options.map(({option,votes} ,i) =>{
                        const option_text_props = Object.assign( {}, 
                                                                 textProps, 
                                                                 {  points: text_data[i], 
                                                                    option,
                                                                    votes,
                                                                    i,
                                                                    color : this.color(i),
                                                                    mouseover: this.mouseover,
                                                                    mouseout: this.mouseout,
                                                                    tooltip : tooltip === i
                                                                 }
                                                                );

                        return <Text {...option_text_props} key = {i}/>;
                    })
                }
            </div>
        );
    }
    
}


PieChart.propTypes = {
    question : string,
    options : arrayOf( shape({ option: string, votes: number })),
    width : number,
    height : number
};
  
export default withFauxDOM(PieChart);

