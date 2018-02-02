 
import React from 'react';
import PropTypes from 'prop-types';
import { fetchPoll } from '../../actions/polls';
import {connect} from 'react-redux';
import PieChart from  '../svg/pieChart';
import LoadingElem from '../../common/loadingElement';

class PollPage extends React.Component {

    state = { loading:true };
   
    componentDidMount(){
        const { fetchPoll, match, question } = this.props;
        if (!question) { fetchPoll (match.params._id);}
    }
    
    componentWillReceiveProps() { this.setState({ loading: false });}

    render(){
        
        const { clientWidth, clientHeight} = document.documentElement, 
        height = clientHeight * 0.95, { question, owner, options } = this.props;
        const props = {
            question, 
            owner, 
            options,
            height,
            width: clientWidth,
        };
        
        return ( 
            this.state.loading? <LoadingElem/> : <PieChart { ...props } />
        );
    }

}

const { arrayOf, string, number, shape } = PropTypes;

PollPage.propTypes = {
    question : string,
    owner : string,
    options : arrayOf( shape({ option: string, votes: number }))
};

const mapStateToProps = ( state, props ) => {
    const _id = props.match.params._id,
    poll = _id ? state.polls.find( item => item._id === _id ) :null;
    if( !poll )  return {};
    const { question, owner, options } = poll;
    return { question, owner, options };
};

export default connect( mapStateToProps,{ fetchPoll })( PollPage );
