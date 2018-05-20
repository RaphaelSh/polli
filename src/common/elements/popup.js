import React from 'react';

const Popup = ({addition}) => { 
    const before = {
            position:'absolute',
            left:'70%',
            top:'30%',
            marginLeft: '-10px',
            borderWidth: '10px',
            borderStyle: 'solid',
            borderColor: 'transparent #f5f4f0 transparent transparent',
            transform:'translate(-10px,100px)'
        };
        
        const popup = {
            position:'absolute',
            left:'70%',
            top:'30%',
            width:'25%',
            padding:'1%',
            lineHeight:'16px',
            fontSize:'15px',
            fontFamily:'Raleway',
            borderRadius:'3%',
            background:'#f5f4f0',
            color:'#403d3a',
            overflow:'scroll',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.2)'

        }
        
        return  (   <div>
                    <div style = {popup} >
                            <p>Due to security reasons, all passwords must have:</p>
                            <ul>
                                <li>8 characters in length</li>
                                <li>Contain at least 3 of the following 4 types of characters:</li>
                                <ul>
                                    <li>Lower case letters (a-z),</li>
                                    <li>Upper case letters (A-Z),</li>
                                    <li>Numbers (i.e. 0-9),</li>
                                    <li>Special characters (e.g. !@#$%^&* )</li>
                                </ul>
                                <li>Passwords should not contain variations of your username or email.</li>
                            </ul>
                    </div>
                    <div style={before}></div>
                    </div>
                );
}

export default Popup;
