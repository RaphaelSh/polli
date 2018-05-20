import React, { Component } from 'react';


export default class question extends Component{
    
    state = { value : '' }
    
    componentDidMount(){
        let { question } = this.props; question = question.split('');
 
        const animateText = () => {
            if ( !question.length ) clearInterval(this.timer);
            else this.setState({ value: this.state.value+question.shift() });
                      //  console.log('animateText: ',++num);

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
                    color : '#642',
                    fontSize : height*0.03
        };
            
        const question_style = {
            display : 'table-cell',
            verticalAlign : 'middle',
            fontFamily:'Julius Sans One'
        };
        
        return (<div style={div_style} >
                    <p style={ question_style }> { this.state.value }</p>
                </div>
        );
    }
}