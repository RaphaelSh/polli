import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect'


import { Accordion, Icon, Grid, Transition  } from 'semantic-ui-react'
import PollOptions from './poll';

class PollsPage extends Component {
        
        state = { loading:true, activeIndex: -1, polls: this.props.polls || {} }

        handleClick = (e, titleProps) => {
            const { index } = titleProps;
            this.setState({ activeIndex: this.state.activeIndex === index ? -1 : index });
        }
        
        componentDidMount(){
            this.props.fetchPolls(this.props.auth.user.id); 
        }
        
        componentWillReceiveProps( nextProps ){
          if( this.state.polls !== nextProps.polls ) this.setState({ polls: nextProps.polls });
           this.setState({ loading:false }); 
        } 
        
       
  
        render(){
            const { auth } = this.props, { username } = auth.user, { activeIndex, polls } = this.state;

            return(
                this.state.loading?
                 <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading</div>
                 </div>:
            
                    <Grid verticalAlign = 'middle' centered columns={2} className = 'pollsPage' stackable>
                        
                        <Grid.Column width={6} className='welcome_class' >
                            { !!polls.length ? <h1 >{`Welcome ${ username }, here are your polls!`}</h1> : 
                                <div style={{textAlign : 'center'}}> 
                                    <h1>{`Welcome ${ username } to your polls page!`}</h1>
                                    <h3>This page is now empty since you don't have any polls yet so go ahead and add some!</h3>
                                </div> }
                        </Grid.Column>
                        { !!polls.length &&
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
                                        <Icon name='dropdown' className = 'dropdown'/>
                                        <Grid>
                                            <Grid.Column width = {12} className='pollQuestionContainer'>
                                                <p className='pollQuestion'>{poll.question}</p>
                                            </Grid.Column>
                                            <Grid.Column className='createdAt' textAlign='right' width = {4}>{ /(\d{4}-\d{2}-\d{1,2}).*/.exec(poll.createdAt)[1] }</Grid.Column>
                                        </Grid>
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

                        </Grid.Column>}
                    </Grid>
            );
        }
}

PollsPage.propTypes = {
    auth: PropTypes.object.isRequired,
    polls: PropTypes.array.isRequired
};


const mapDispatchToProps = dispatch => ({
    fetchPolls: user_id => dispatch({ type: 'FETCH_POLLS', user_id }), 
    deletePoll: poll_id => dispatch ({ type: 'DELETE_POLL', poll_id })
});

const auth = state => state.auth;
const polls = state => state.polls;

const mapStateToProps = state => createSelector (
    [auth, polls] , (auth, polls) => {
        return { auth, polls };
    }
);


export default connect( mapStateToProps, mapDispatchToProps )( withRouter(PollsPage) );
