import React from 'react';
import TextField from '../../common/elements/textFormField';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import { Transition, Grid } from 'semantic-ui-react';
import Loading from '../../common/elements/loadingElement';
import CanvasElement from './background';

//import { addNewPoll, fetchPoll, updatePoll } from '../../actions/polls';

    const validateInput = (question, options) => {
        let errors = {};
        
        if(isEmpty(question)) errors.question = 'A question is requiered to start a poll';
        
        options = options.filter(opt => !isEmpty(opt));
        if( options.length < 2 ) errors.options = 'You need at list two option to start a poll';
        if(question) question = question.match(/\?$|!$|\.$/g) ? question: question+'?';
        
        return {
          errors,
          isValid: isEmpty(errors),
          question,
          options
        };
    };

class pollForm extends React.Component {
    
    constructor(props) {
        
        super(props);
        
        this.state = {
            _id: this.props.poll? this.props.poll._id :null,
            question: this.props.poll? this.props.poll.question : '',
            options: this.props.poll? this.props.poll.options: new Array(3).fill(''),
            
            placeholders : {
              question : 'To be or not to be?',
              options : ['To be!','Not to be',"Well it depends.."]
            },
            
            errors : {},
            isLoading : true,
            redirect : false,

            shake : true
        };
        
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.addOption = this.addOption.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.removeAll = this.removeAll.bind(this);
        this.setmycanvasRef = element => { this.mycanvas = element };

    }
    
    componentDidMount = () => {
        if(! this.props.match.params._id) { this.setState({isLoading:false}); return;}
        this.props.fetchPoll(this.props.match.params._id);
    }
    
    componentWillReceiveProps = (nextProps) => {
        if(nextProps && nextProps.poll){
            this.setState({
                _id: nextProps.poll._id,
                question: nextProps.poll.question,
                options: nextProps.poll.options.map( opt => opt.option ),
                isLoading:false
           });
        }
    }
    
    
    componentDidUpdate = (nextProps) => { 
        if( this.state.redirect ) { this.props.history.push('/mypolls'); }
    }
    
    shouldComponentUpdate (nextProps, nextState) {
        return nextState !==this.state;
    }
    
    //updateCanvas (el) { if(el) { background(el) } } 

    
    onChange(e) {
        
        const cur = e.currentTarget;
        if ( cur.name ==='question' ) this.setState({ question : e.target.value });
        
        else {
            const options = this.state.options, index = cur.dataset.index;
            options[index] = e.target.value;
            this.setState({options});
        }
    }
    
    savePoll = (poll_id, question, options, user ) => {
        if (poll_id) { this.props.updatePoll ({ poll_id, question, options }) }
        else { this.props.addNewPoll({ question, options, user }) }
    }
    
    onSubmit(e){
        e.preventDefault();
       
        let { options, question, errors, isValid } = validateInput(this.state.question, this.state.options);
       
        if( !isValid ) { this.setState({ errors: errors, shake: !this.state.shake }); return;}
        
        const { _id } = this.state, { user } = this.props;
        
        this.setState({ errors: {}, isLoading: true, redirect:true },() => this.savePoll(_id, question, options, user ));
        
    }
    
    addOption(e) {
        e.preventDefault();
        let options = this.state.options;
        options.push('');   
        this.setState({ options });
    }
    
    removeOption (e) {
        e.preventDefault();
        if(e.target.tagName ==='I'){
            const index = Number(e.currentTarget.dataset.index);
            let options = this.state.options.filter((it, ind) =>{ return index!==ind});
            this.setState({options});
        }
    }
    
    removeAll (e) {
        this.setState({options:[]});   
    }
    
    render(){

        const { question , errors, isLoading, options, placeholders, shake } = this.state;
        
        const overlay = {
                      width:"100vw",
                      height:"100vh",
                      
                      background:'rgba(240, 230, 220,.8)',
                      overflow: 'hidden'
        };
       
        
        return  isLoading? <Loading/>: 
            ( 
         <div style = {overlay}>
         <CanvasElement/>
            <Grid centered verticalAlign='middle' className = 'addNewPoll'>
            <Grid.Column width={10}>
            <Transition animation='shake' duration = {700} visible = { shake }>
                <form className = { classnames("ui","form","column","segment",'padded','raised','addNewPollForm',{loading:!!this.state.isLoading}) } onSubmit = {this.onSubmit}>
               
                    <h1 className = 'ui header grey' > Create a new poll </h1>

                     <div className="ui grid right aligned" >

                        <div className = 'right floated eight wide column' >
                            <button disabled = { isLoading } className="ui grey basic button" tabIndex="0" onClick = {this.addOption}>
                               Add an option
                            </button>
                            <button disabled = { isLoading } className="ui grey basic button" tabIndex="0" onClick = {this.removeAll}>
                               Remove all
                            </button>
                        </div>
                    </div>
                    <TextField 
                                field = 'question'
                                label = 'Your poll question:'
                                name = 'question'
                                onChange = { this.onChange }
                                value = { question }
                                type = 'text'
                                placeholder = { placeholders.question }
                                index = 'question'
                                addIcon = { false }
                    />
                    {options.length > 0 && options.map((option, index)=>
                        <TextField 
                                field = 'Option'
                                label = {'Option no. '+( index+1 )+':'}
                                name = 'Option'
                                onChange = { this.onChange }
                                value = { option }
                                type = 'text'
                                placeholder = {placeholders.options[index]}
                                addIcon = {true}
                                iconClickFunc = {this.removeOption}    
                                key = {"option"+index.toString()}
                                index = {index}
                        />
                    )}
                    {(errors.question||errors.options) && 
                            <div className="ui negative message">
                                 <p>{errors.question}</p> 
                                 <p>{errors.options}</p>
                            </div>
                    }
                    <div className="ui grid right aligned" >
                        <div className = 'column center aligned'>
    
                            <button disabled = {isLoading} type='submit' className="ui grey basic button" tabIndex="0">
                               Save
                            </button>
                        </div>
                    </div>
                </form>
            </Transition>
        </Grid.Column>
        </Grid>
    </div>
        );
    }
}
//            <canvas width = {window.innerWidth} height = {window.innerHeight} ref={this.updateCanvas.bind(this)} style = {canvas} ></canvas>

const func = PropTypes.func.isRequired;

pollForm.propTypes = {
  addNewPoll: func,
  fetchPoll: func
};

function mapStateToProps(state, props) {
    const _id = props.match.params._id,
        poll = _id ? state.polls.find(item => item._id === _id) :null;
    return {
        user:state.auth.user,
        poll: poll
    };
}

const mapDispatchToProps = dispatch => ({
  addNewPoll : pollData  => dispatch ({ type: 'ADD_NEW_POLL', pollData }), 
  fetchPoll :  poll_id => dispatch ({ type: 'FETCH_POLL', poll_id }),
  updatePoll : pollData => dispatch ({ type: 'UPDATE_POLL', pollData })
})


export default connect(mapStateToProps, mapDispatchToProps )(withRouter(pollForm));
