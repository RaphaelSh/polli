import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//import { deleteFlashMessage } from '../../actions/addFlashMessages';
import { Message, Icon } from 'semantic-ui-react'

class FlashMessage extends React.Component {
    constructor(props) {
        super (props);
        this.onClick = this.onClick.bind(this);
    }
    
    onClick (e) {
        this.props.deleteFlashMessage(this.props.message.id);
    }
    
    render() {
       const { type, text } = this.props.message;

        return(<Message positive = {type==='success' } 
                        warning = { type==='error' }
                        style = {{zIndex:'999 !important'}}
                >
                <Icon  name='close' onClick = { this.onClick }/>
                { text }
                </Message>
            ); 
    }
    
}

FlashMessage.propTypes = {
    message: PropTypes.object.isRequired,
    deleteFlashMessage: PropTypes.func.isRequired 
}


class FlashMessagesList extends React.Component {
    render() {
       const messages = this.props.messages.map(message => 
                <FlashMessage   key={ message.id } 
                                message = { message } 
                                deleteFlashMessage = { this.props.deleteFlashMessage }
                />
        );
        return(
             <div>{ messages }</div>
        ); 
    }
    
}

FlashMessagesList.propTypes = {
    messages: PropTypes.array.isRequired,
    deleteFlashMessage: PropTypes.func.isRequired 
};

const mapStateToProps = ({ flashMessages }) => ({ messages: flashMessages });

const mapDispatchToProps = dispatch => ({
    deleteFlashMessage: id => dispatch({ type: 'DELETE_FLASH_MESSAGE',id })
})
 
export default connect( mapStateToProps, mapDispatchToProps )(FlashMessagesList);
