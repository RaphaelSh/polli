import React from 'react';
import PropTypes from 'prop-types';

const SingupLoginImg = ({ header_style,signup, change_page })  => {
        
        
        // ---------- image ---------- //
        const img = {
            overflow: 'hidden',
            zIndex: '2',
            position: 'absolute',
            left: '0',
            top: '0',
            width: '260px',
            height: '100%',
            paddingTop: '360px'
        }
        const before = {
            content: '',
            zIndex: '1',
            position: 'absolute',
            right: '0',
            top: '0',
            width: '900px',
            height: '100%',
            backgroundImage: 'url("https://images.unsplash.com/photo-1505409628601-edc9af17fda6?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d2ff0749f9f185c7a63c194515eca7e6&auto=format&fit=crop&w=1350&q=80")',
            backgroundSize: 'cover',
            transition: 'transform 1.2s ease-in-out',
        };
        
        if( signup ) { before['transform'] = 'translateX(640px)'; }
        
        const filter = {
            content: '',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.4)'
        };
        // ------
        
        // image-text
        //-----------
        
        const img_text = {
            zIndex: '4',
            position: 'absolute',
            top: '50px',
            left: '0',
            width: '100%',
            padding: '0 20px',
            textAlign: 'center',
            color: '#fff',
            transition: 'transform 1.2s ease-in-out'
        }
        
        const img_text_login = signup => {
            return signup ? Object.assign({},img_text, {
                transform: `translateX(520px)`
            }): img_text;
        };
        
        const img_text_signup = signup => {
            return Object.assign({}, img_text, {
                transform: signup ? `translateX(0px)`:'translateX(-520px)'
            });
        }
        
        const header = Object.assign( {}, header_style,{
            marginBottom: '10px',
            fontWeight: 'normal',
            color:'#fff'
        });
        const p = {
            fontSize: '20px',
            lineHeight: '1.5'
        }
        
        // img button
        
        const img_button = {
            overflow: 'hidden',
            zIndex: '4',
            position: 'relative',
            width: '100px',
            height: '36px',
            margin: '0 auto',
            background: 'transparent',
            color: '#fff',
            textTransform: 'uppercase',
            fontSize: '15px',
            cursor: 'pointer'
        };
        
        const img_button_after = {
            content: '',
            zIndex: '4',
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            border: '2px solid #fff',
            borderRadius: '30px',
        };
        
        const span = {
            position: 'absolute',
            left: '0',
            top: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            transition: 'transform 1.2s'
        };
        
        const span_signup = Object.assign({},span, {
           transform: signup ? 'translateY(0)': 'translateY(-72px)'
        });
        
        const span_login = signup ? Object.assign({},span, {
            transform: 'translateY(72px)'
        }) : span;
        

        return  <div>
                    <div style = { img } >
                        <div style = { before }>
                            <div style = { filter } />
                        </div>
                        <div style = { img_text_login(signup) }>
                            <h2 style = { header } >New here?</h2>
                            <p style = { p } >Sign up and discover great amount of new opportunities!</p>
                        </div>
                        <div style = { img_text_signup(signup) } >
                            <h2 style = { header } >One of us?</h2>
                            <p style = { p } >If you already have an account, just sign in. We've missed you!</p>
                        </div>
                        <div style = { img_button } onClick = { change_page }>
                                <span style = { span_login }>Sign Up</span>
                                <span style = { span_signup } >Sign In</span>
                                <div style = { img_button_after }/>
                        </div>
                    </div>
                </div>;
            
}

const { object,bool, func } = PropTypes;
SingupLoginImg.propTypes = {
    header_style : object.isRequired,
    signup:bool.isRequired,
    change_page: func.isRequired
};


export default SingupLoginImg;



