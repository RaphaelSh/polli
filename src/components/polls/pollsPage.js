import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fetchPolls } from '../../actions/polls';
import { Accordion, Icon, Grid, Transition  } from 'semantic-ui-react'
import PollOptions from './poll';
import { deletePoll } from '../../actions/polls'

class PollsPage extends Component {
        
        state = { loading:true, activeIndex: -1, polls: this.props.polls || {} }

        handleClick = (e, titleProps) => {
            const { index } = titleProps;
            this.setState({ activeIndex: this.state.activeIndex === index ? -1 : index });
        }
        
        componentWillMount(){
            this.props.fetchPolls(this.props.auth.user.id);
        }
        
        componentWillReceiveProps( nextProps ){
            console.log(this.state.polls, nextProps.polls, this.state.polls !== nextProps.polls)
           if( this.state.polls !== nextProps.polls ) this.setState({ polls: nextProps.polls });
           this.setState({ loading:false }); 
        }
  
        render(){
            
            const { auth } = this.props, { username } = auth.user, { activeIndex, polls } = this.state,
            
            CreatedAt = ({ createdAt }) =>( 
                <span className = 'createdAt' > { /(\d{4}-\d{2}-\d{1,2}).*/.exec(createdAt)[1] }</span>
            );
            
            return(
                this.state.loading?
                 <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading</div>
                 </div>:
            
                    <Grid verticalAlign = 'middle' container centered columns={2} className = 'pollsPage'>
                        
                        <Grid.Column width={6} className='welcome_class'>
                            <h1 >{`Welcome ${ username }, here are your polls!`}</h1>
                        </Grid.Column>

                        <Grid.Column width={10} className='myPollsView' >
                        
                            <Accordion styled className = 'pollsAcordion'>

                            { polls.map((poll,index) => (
                                <div key = {`poll${index}`} >
                                <Transition animation='slide down' duration={300}>
                                    <Accordion.Title  active={activeIndex === index} 
                                                        index={index} 
                                                        onClick={this.handleClick}
                                                         className = 'animatedAccordion'
                                                        >
                                        <Icon name='dropdown'/>
                                        {poll.question}
                                        <CreatedAt createdAt = {poll.createdAt}/>   
                                    </Accordion.Title>
                                   </Transition>

                                    <Transition visible = {activeIndex === index} animation='slide down' duration={300}>
                                        <Accordion.Content active={activeIndex === index} className = 'animatedAccordion'>
                                           <PollOptions options = { poll.options } _id = { poll._id } deletePoll = {this.props.deletePoll} />
                                        </Accordion.Content>                                                        
                                    </Transition>

                                </div>
                            ))}

                            </Accordion>

                        </Grid.Column>
                    </Grid>
            );
        }
}

PollsPage.propTypes = {
    auth: PropTypes.object.isRequired,
    polls: PropTypes.array.isRequired
};

const mapStateToProps = ({ auth, polls }) => ({ auth, polls });

export default connect(mapStateToProps,{ fetchPolls, deletePoll })( withRouter(PollsPage) );