import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addFlashMessages } from '../actions/addFlashMessages';

const Authenticate = (ComposedComponent) => class extends React.Component {
    
        componentWillMount() {

            if(!this.props.isAuthenticated){
                this.props.addFlashMessages({
                    type:'error',
                    text:'You need to login to access this page'
                });
             this.props.history.push('/login');
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

    Authenticate.prototype = {
        isAuthenticated: PropTypes.bool.isRequired,
        addFlashMessages: PropTypes.func.isRequired
    }

    const mapStateToProps = (state,props) => {
         return { isAuthenticated: state.auth.isAuthenticated };
    };
    

export default (ComposedComponent) =>{
   ComposedComponent = Authenticate(ComposedComponent);
   return connect(mapStateToProps,{ addFlashMessages })(ComposedComponent);
};
