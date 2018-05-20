// style 
export const header_style = {
            width: '100%',
            fontSize: '26px',
            textAlign: 'center',
            color: '#444',
            paddingBottom: '1.2em',
            fontFamily: 'Abhaya Libre'
};
        
export const cont = {
            overflow: 'hidden',
            position: 'relative',
            width: '900px',
            height: '600px',
            margin: '0 auto',
            top:'5%',
            background: '#fff',
            boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
};
        
export const forgot_pass = {
            marginTop: '15px',
            textAlign: 'center',
            fontSize: '15px',
            color: '#afafaf'
}
        
export const subCont = {
            overflow: 'hidden',
            position: 'absolute',
            left: '640px',
            top: '0',
            width: '900px',
            height: '100%',
            paddingLeft: '260px',
            background: '#fff',
            transition: 'transform 1.2s ease-in-out'
}
        
export const form = {
            position: 'relative',
            width: '640px',
            height: '100%',
            transition: 'transform 1.2s ease-in-out',
            padding: '50px 30px 0'
        };
        
export const form_sign_up = Object.assign({},form, {
            transform: 'translate3d(-900px, 0, 0)'
        });
        
export const form_login = Object.assign({},form, {
            transition: 'transform 1.2s ease-out'
        });
        
        
export const body = {
            width:'100%',
            height:'100%',
            background: 'linear-gradient(to right, #c5bdaf, #d5cdbf, #e5ddcf)',//dacdbf//#c0bdaa, #d0cdba, #e0ddca
            fontFamily: 'Abhaya Libre',
            position:'relative',
            overflowY:'scroll'
};