import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Loading from '../common/elements/loadingElement';

import PropTypes from 'prop-types';
//import { fetchAllPolls, saveVote } from '../actions/polls';
import { Menu, Icon,Grid, Divider, Segment } from 'semantic-ui-react';

import PollCard from './polls/pollsGrid_home/pollCard';

import PollModal from './utils/modal';

class home extends Component {
    
    constructor(props){
        super(props);
        
        this.state = {
                selection:'all',
                voted:false,
                loading: true,
                modalOpen:false,

                question: '', 
                option: '' ,
                _id:'',
                opt_id:'',
                
                headerOpacity:1,
        };
        this.selectPoll = this.selectPoll.bind(this);
        this.consentFuc = this.consentFuc.bind(this);
        this.dismissFunc = this.dismissFunc.bind(this);
        
    }
    
    // -------------- home's functions --------------
    
    componentWillMount () {
                this.props.fetchAllPolls(this.state.selection);
    }
    
    componentWillReceiveProps(){
        if (this.state.voted) { this.props.history.push(`/pollPage/${this.state._id}`); }
        this.setState({ loading:false });
    }
    

    handleItemClick = (e, { name }) => {
        name = name.toLowerCase();
        this.setState({ selection: name });
        this.props.fetchAllPolls(name);
    }
    
    
    // -------------- single card functions --------------
 
    selectPoll = ( e, { _id, index }) => {
        const { question, options } = _.find(this.props.polls, o => o._id === _id ),
        opt = options[index];
        this.setState({
            _id, 
            question,
            option : opt.option,
            opt_id : opt._id,
            modalOpen: true
        });
    }
    
    consentFuc = ( e, props ) => {
        const {_id, opt_id } = this.state,
        { saveVote } = this.props;
        
        saveVote({ _id, opt_id });
        this.setState({ loading:true, modalOpen:false, voted:true });
    }
    
    dismissFunc = ( e, props ) => {
        this.setState({ modalOpen: false })   
    }
    
    scroll = (e) => {
        const pos = this.refs.homeBody.scrollTop;
        if(pos <= (window.innerHeight - 50)) { this.props.opacityAnim( 'PAGE_SCROLL_IN_HOME', pos ); }
        else { this.props.opacityAnim( 'PAGE_SCROLL_OUT_OF_HOME' );} 
    }

    render(){
        const { polls } = this.props, { selection, option, question, modalOpen } = this.state;
        const selectionOptions = ['all','most-recent','most-popular'];
        
        return ( this.state.loading?
                <Loading/>:
                <div id = 'html'>
                    <div id = 'home' ref = 'homeBody' onScroll = {_.throttle(this.scroll,100)}>
                        <PollModal
                                    open = { modalOpen }
                                    question = { question }
                                    selectedOption = { option }
                                    consentFuc = { this.consentFuc }
                                    dismissFunc= { this.dismissFunc }
                                    
                        />
                        <video autoPlay muted loop>
                            <source src='https://res.cloudinary.com/dxnxfwsok/video/upload/v1520438656/People_-_3626_zehvpq.mp4' type="video/mp4" />
                        </video>
                        <div className='header-text'>
                                <h1>POLLI VOTTING APP</h1>
                                <h2> find out what everyone thinks!</h2>
                        </div>
                        <Segment className='home-body' >
                             <div className='home-polls'>
                                        <h2> View our polls and vote </h2>
                                        <h2 id='or'>OR</h2>
                                        <h2> Login to create a poll and share it with your friends! </h2>
                            
                                <Menu pointing secondary>
                                        { selectionOptions.map((opt,key) =>(
                                        < Menu.Item name={ opt.replace(/(^[a-z]?)/,(m, p) => p.toUpperCase()) } 
                                                    active={ selection === opt } 
                                                    onClick={this.handleItemClick } 
                                                    key = {`menu ${opt}`}
                                        />)
                                        )}
                                </Menu>
                                 <Divider hidden />

                                <Grid columns={4} container>
                                    { polls.map( ( poll,index ) =>{ 
                                                return <PollCard   
                                                    { ...poll } 
                                                    key = { poll.owner + index }
                                                    selectPoll = {this.selectPoll}
                                                />
                                    })}
                                </Grid>
                            </div>
                            <footer>
                                    <p>raphael.shalem@gmail.com</p>
                                    <Icon name = 'github'/>
                                    <Icon name = 'facebook f'/>
                                    <Icon name = 'twitter'/>
                                    <Icon name = 'linkedin square'/>
                            </footer>
                        </Segment>
                    </div>
                </div>

        );
    }
    
}
/*
                    

*/

const { arrayOf, shape, string, number } = PropTypes;

home.propTypes = { 
    polls: arrayOf( shape({
        createdAt: string,
        options: arrayOf ( shape({
            option: string,
            votes: number
        })),
        owner: string,
        question: string,
        sum: number,
        _id: string
    })) 
};

const mapStateToProps = ({ polls = [], home_animations = {}, auth }) => {
  return {
      polls,
      headerOpacity: home_animations.op,
      home_body_transform: home_animations.home_body_transform
  }  
}
const mapDispatchToProps = dispatch => ({
    fetchAllPolls : poll_type => dispatch ({ type: 'FETCH_ALL_POLLS', poll_type }),
    saveVote : poll_data => dispatch ({ type: 'VOTE', poll_data }),
    opacityAnim : ( type, pos ) => dispatch ({ type, pos }),
});

  
export default connect( mapStateToProps , mapDispatchToProps)(withRouter(home));

