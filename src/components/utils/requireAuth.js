import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
//import { addFlashMessages } from '../../actions/addFlashMessages';

const Authenticate = (ComposedComponent) => class extends React.Component {
    
        componentDidMount() {
            if(!this.props.isAuthenticated){
                this.props.addFlashMessages({
                    type:'error',
                    text:'You need to login to access this page'
                });
             this.props.history.push('/signup/0');
            }
        }
        
        componentWillUpdate(nextProps) {
            if(!nextProps.isAuthenticated){
               this.props.history.push('/');
            }
        }
        
        render(){
            return(
                <ComposedComponent {...this.props} />
            );
        }
 }

const { bool, func } = PropTypes;
Authenticate.prototype = {
        isAuthenticated: bool.isRequired,
        addFlashMessages: func.isRequired
}

const mapStateToProps = ({ auth }) => ({ isAuthenticated: auth.isAuthenticated });

const mapDispatchToProps = dispatch => ({ addFlashMessages : message => dispatch({ type: 'ADD_FLASH_MESSAGE', message })});
    

export default ( ComposedComponent ) =>{
   ComposedComponent = Authenticate(ComposedComponent);
   return connect( mapStateToProps, mapDispatchToProps )( ComposedComponent );
};
