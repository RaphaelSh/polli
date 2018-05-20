 
import React from 'react';
import PropTypes from 'prop-types';
//import { fetchPoll } from '../../actions/polls';
import {connect} from 'react-redux';
import PieChart from  '../svg/pieChart';
import LoadingElem from '../../common/elements/loadingElement';
import CanvasElement from './background';

import { Grid } from 'semantic-ui-react';


class PollPage extends React.Component {

    state = { loading:true, resize: 0 };
   
    componentDidMount(){
        const { fetchPoll, match, question } = this.props;
        if (!question) { fetchPoll( match.params._id );}
        else { this.setState({loading:false}) }
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({ loading: false });
        if( nextProps.resize !== this.state.resize_num ) {
            this.setState({ resize: nextProps.resize })
        }
    }
    render(){
        if( this.state.loading ) return <LoadingElem/>;
        
        const { windowHeight, windowWidth} = this.props, 
        { question, options } = this.props,
        
        props = {
            question, 
            options,
            height : windowHeight,
            width: windowWidth < 780 ? windowWidth : windowWidth* 0.7,
            showLines: windowWidth < 780 ? false : true
        };

        return <Grid centered className = 'pollPage' >         
                <CanvasElement/>
                <PieChart { ...props } />
               </Grid>;
    }

}

const { arrayOf, string, number, shape } = PropTypes;

PollPage.propTypes = {
    question : string,
    options : arrayOf( shape({ option: string, votes: number }))
};

const mapStateToProps = ( { polls, resize }, props ) => {
    const _id = props.match.params._id,
    poll = _id ? polls.find( item => item._id === _id ) :null;
    if( !poll )  return {};
    console.log('poll: ',poll);
    let { question, options } = poll, {windowHeight, windowWidth} = resize;

    return { question, options, windowHeight, windowWidth };
};

const mapDispatchToProps = dispatch => ({
    fetchPoll : poll_id => dispatch ({ type: 'FETCH_POLL', poll_id })
})

export default connect( mapStateToProps, mapDispatchToProps )( PollPage );
