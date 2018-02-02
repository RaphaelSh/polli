import React,{ Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';

import PropTypes from 'prop-types';
import { fetchAllPolls, saveVote } from '../actions/polls';
import { Menu  } from 'semantic-ui-react';


import './style/home.scss';
import PollsGrid from './polls/pollsGrid';

import PollModal from './modal';


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
                opt_id:''
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
                    <h1 className='home_header'>WELCOME TO POLLI!</h1>
                    <div>
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

export default connect( ({ polls }) => ({ polls }), { fetchAllPolls, saveVote })(withRouter(home));

