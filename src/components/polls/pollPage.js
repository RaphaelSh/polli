 
import React from 'react';
import PropTypes from 'prop-types';
//import { fetchPoll } from '../../actions/polls';
import {connect} from 'react-redux';
import PieChart from  '../svg/pieChart';
import LoadingElem from '../../common/elements/loadingElement';

import { Grid } from 'semantic-ui-react';


class PollPage extends React.Component {

    state = { loading:true };
   
    componentDidMount(){
        const { fetchPoll, match, question } = this.props;
        if (!question) { fetchPoll (match.params._id);}
    }
    
    componentWillReceiveProps() { 
        console.log('componentWillReceiveProps: ',this.props.options);
        this.setState({ loading: false });
    }

    render(){
        if( this.state.loading ) return <LoadingElem/>;
        
        const { clientWidth, clientHeight} = document.documentElement, 
        height = clientHeight, { question, owner, options } = this.props;

        const props = {
            question, 
            owner, 
            options,
            height,
            width: clientWidth* 0.7,
        };
        
        return <Grid centered className = 'pollPage'><PieChart { ...props } /></Grid>;
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
    console.log('mapStateToProps: ',options);

    return { question, owner, options };
};

const mapDispatchToProps = dispatch => ({
    fetchPoll : poll_id => dispatch ({ type: 'FETCH_POLL', poll_id })
})

export default connect( mapStateToProps, mapDispatchToProps )( PollPage );
