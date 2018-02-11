import React from 'react';

import {Icon, Button, Header, Modal  } from 'semantic-ui-react';

class pollModal extends React.Component {
    render(){
        const { open, modalTriger, question, selectedOption, consentFuc, dismissFunc } = this.props;
        return (
            <Modal
                open = { open }
                trigger = { modalTriger }
                size='small'
            >
                <Header icon='warning circle' content='Are you sure?' className = 'modalHeader'
/>
                <Modal.Content className = 'modalContent'>
                  <h3>Before we submit your vote, we just want to make sure it is final.</h3>
                  <h3>You chose to vote for <b className='selection'>"{selectedOption}"</b> for the question: <b className='selection'>"{question}"</b></h3>
                </Modal.Content>
                <Modal.Actions className = 'modalActions'>
                      <Button basic onClick = { dismissFunc }>
                        <Icon name='remove' /> No, wait, I regret..
                      </Button>
                      <Button color='brown' basic onClick = { consentFuc } className='buttonCon'>
                        <Icon name='checkmark' /> Vote!
                      </Button>
                </Modal.Actions>
            </Modal>
        );
    } 
}
export default pollModal;

