import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect'
import Loading from '../../../common/elements/loadingElement';

import { Accordion, Icon, Grid, Transition  } from 'semantic-ui-react';
import Image from '../Image';
import PollOptions from './poll';

import CanvasElement from '../background';

class PollsPage extends Component {
        
        constructor (props) {
            super(props);
            this.state = { ref_set:false,
                           loading: true, 
                           fetching:false, 
                           activeIndex: -1, 
                           polls: props.polls || [] 
            }
        }
        

        handleClick = (e, titleProps) => {
            const { index } = titleProps;
            this.setState({ activeIndex: this.state.activeIndex === index ? -1 : index });
        }
        
        componentDidMount(){
            this.setState({ fetching:true },() =>
                this.props.fetchPolls(this.props.auth.user._id)); 
        }
        

        componentWillReceiveProps( nextProps ) {
            const { fetching, polls } = this.state;
            if(( fetching && polls === nextProps.polls ) || !fetching ){ return }
            
            const finish = () => this.setState({ loading:false });
            this.state.polls === nextProps.polls ? finish() : 
                        this.setState({ polls: nextProps.polls },() => finish()); 
        }
        
        render() {
            
            const { auth } = this.props, 
                  { name } = auth.user, 
                  { activeIndex, polls, loading } = this.state;
            
            const overlay = {
                      width:"100vw",
                      height:"100vh",
                      background:'rgba(240, 230, 220,.9)',
                      overflow: 'hidden'
            };
            
            return(
                loading?
                 <Loading/>:
                 <div style = {overlay}>
                          <CanvasElement/>
                    <Grid verticalAlign = 'middle' centered columns={2} className = 'pollsPage' stackable>

                         <Grid.Column width={4} className='welcome_class' >
                            <Image src='https://images.unsplash.com/photo-1422189668989-08f214d6e419?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4dbb4c54da3179f872519e5adef43e04&auto=format&fit=crop&w=1350&q=80'/>
                             <div style={{textAlign : 'center'}}> 
                                    <h2>{!!polls.length ? `Welcome ${ name },`:`Welcome ${ name } to your polls page!`} </h2>
                                    <h3>{!!polls.length ? `here are your polls!`:
                                        "This page is now empty since you don't have any polls yet so go ahead and add some!" }</h3>
                            </div> 
                        </Grid.Column>
                        <Grid.Column width={12} className='myPollsView' >
                        { !!polls.length &&
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
                        }
                        </Grid.Column> 
                    </Grid>
                </div>
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
