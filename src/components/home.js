import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import PropTypes from 'prop-types';
//import { fetchAllPolls, saveVote } from '../actions/polls';
import { Menu, Icon } from 'semantic-ui-react';

import PollsGrid from './polls/pollsGrid_home/pollsGrid';

import PollModal from './utils/modal';


class home extends Component {
    
    constructor(props){
        super(props);
        this.state = {
                selection:'all',
                loading: true,
                modalOpen:false,
                // voted poll information 
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

    componentDidMount () { 
        this.props.fetchAllPolls(this.state.selection);
        
    }
    
    componentWillReceiveProps(){
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
        const {_id, opt_id } = this.state;
        this.props.saveVote({ _id, opt_id });
        this.setState({ loading:true, modalOpen:false });
        this.props.history.push(`/pollPage/${_id}`);
    }
    
    dismissFunc = ( e, props ) => {
        this.setState({ modalOpen: false })   
    }
    

    render(){
        const { polls } = this.props, { selection, option, question, modalOpen } = this.state,
        
        selectionOptions = ['all','most-recent','most-popular'];
        
        return ( this.state.loading?
                <div className="ui active inverted dimmer">
                        <div className="ui text loader">Loading</div>
                </div>
                :
                <div className = 'home'>
                    <PollModal
                                open = { modalOpen }
                                question = { question }
                                selectedOption = { option }
                                consentFuc = { this.consentFuc }
                                dismissFunc= { this.dismissFunc }
                                
                    />
                    <div className = 'home-header' style = {{ opacity: this.props.headerOpacity }}>
                        <video autoPlay muted loop>
                              <source src={ require('../common/media/people.mp4') } type="video/mp4" />
                        </video>
                        <div className='header-text'>
                            <h1>POLLI VOTTING APP</h1>
                            <h2> find out what everyone thinks!</h2>
                        </div>
                    </div>
                    
                    
                    <div className='home-polls'>
                        <div className='header-text'>
                            <h2> View our polls and vote </h2>
                            <h2> Or login to create a poll and share it with your friends! </h2>
                        </div>                        
                        <Menu pointing secondary>
                            { selectionOptions.map((opt,key) =>(
                            < Menu.Item name={ opt.replace(/(^[a-z]?)/,(m, p) => p.toUpperCase()) } 
                                        active={ selection === opt } 
                                        onClick={this.handleItemClick } 
                                        key = {`menu ${opt}`}
                            />)
                            )}
                        </Menu>
                        <PollsGrid  polls = { polls } 
                                    selectPoll = { this.selectPoll }
                        />
                    </div>
                    
                    <footer>
                        <p>raphael.shalem@gmail.com</p>
                        <Icon name = 'github'/>
                        <Icon name = 'facebook f'/>
                        <Icon name = 'twitter'/>
                        <Icon name = 'linkedin square'/>
                    </footer>    
                    
                </div>
        );
    }
    
}

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

const mapStateToProps = ({ polls = [], home_animations = {} }) => {
  return {
      polls,
      headerOpacity: home_animations.op
  }  
}
const mapDispatchToProps = dispatch => ({
    fetchAllPolls : poll_type => dispatch ({ type: 'FETCH_ALL_POLLS', poll_type }),
    saveVote : poll_data => dispatch ({ type: 'VOTE', poll_data })
});

  
export default connect( mapStateToProps , mapDispatchToProps)(withRouter(home));

