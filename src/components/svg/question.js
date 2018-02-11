import React, { Component } from 'react';


export default class question extends Component{
    
    state = { value : '' }
    
    componentDidMount(){
        
        let { question } = this.props; question = question.split('');
 
        const animateText = () => {
            if ( !question.length ) clearInterval(this.timer);
            else this.setState({ value: this.state.value+question.shift() });
        };
        
        this.timer = setInterval(animateText, 30);
    }
    
    render(){
        const { height } = this.props;
        
        const div_style = {
                    position:'absolute',
                    width: height*0.32,
                    height: height*0.32,
                    top:'50%',
                    left:'50%',
                    transform:'translate(-50%,-50%)',
                    textAlign: 'center',
                    display:'table',
                    color : '#642'
        };
            
        const question_style = {
            display : 'table-cell',
            verticalAlign : 'middle',
            fontFamily:'Abhaya Libre'
        };
        
        return (<div style={div_style} >
                    <h1 style={ question_style }> { this.state.value }</h1>
                </div>
        );
    }
}