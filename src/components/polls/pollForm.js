import React from 'react';
import TextField from '../../common/textFormField';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import { Transition } from 'semantic-ui-react';

import { addNewPoll, fetchPoll, updatePoll } from '../../actions/polls';

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
            
            placeholders:{
              question:'Say, what do you think about me?',
              options:['You are the only one I think about!','Well..there are better..',"Oh! you're just unbearable!"]
            },
            
            errors:{},
            isLoading: true,
            redirect:false,
            
            shake: true
        };
        
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.addOption = this.addOption.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.removeAll = this.removeAll.bind(this);
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
    
    componentDidUpdate = (nextProps) =>{
        if( this.state.redirect) { this.props.history.push('/mypolls'); }
    }
    
    onChange(e){
        const cur = e.currentTarget;

        if(cur.name ==='question') { 
            this.setState({ question : e.target.value });
        }
        else{
            const options = this.state.options;
            const index = cur.dataset.index;
            options[index] = e.target.value;
            this.setState({options});
        }
    }
    
    savePoll = (poll_id, question, options, user_id ) =>{
            
            const pos = poll_id? this.props.updatePoll({ poll_id, question, options }):
                                this.props.addNewPoll({ question, options, user_id });
            const promise = new Promise(res=> res(pos));
            return promise.then(()=>this.setState({ redirect: true }));
    }
    
    onSubmit(e){
        e.preventDefault();
       
        let { options, question, errors, isValid } = validateInput(this.state.question, this.state.options);
       
        if( !isValid ) { this.setState({ errors: errors, shake: !this.state.shake }); return;}
        
        const { _id } = this.state, { user } = this.props, user_id = user? user.id : null;
        
        this.setState({ errors: {}, isLoading: true });
        this.savePoll(_id, question, options, user_id )
                    .catch((err) => err.response.json().then(({errors}) => this.setState({ errors, loading:false})))
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
        
        return  this.state.isLoading? ( <div className="ui active inverted dimmer">
                                            <div className="ui text loader">{'Loading'}</div>
                                    </div> ): 
            (<div className = "ui two column centered grid">
                    <div className = "row" />
                    <div className = "row" />
            
            <Transition animation='shake' duration = {700} visible = { shake }>
                <form className = { classnames("ui","form","column","segment",'padded','raised',{loading:!!this.state.isLoading}) } onSubmit = {this.onSubmit}>
               
                    <h1 className = 'ui header blue' >Create a new poll</h1>

                     <div className="ui grid right aligned" >

                        <div className = 'right floated eight wide column' >
                            <button disabled = {isLoading} className="ui blue basic button" tabIndex="0" onClick = {this.addOption}>
                               Add an option
                            </button>
                            <button disabled = {isLoading} className="ui blue basic button" tabIndex="0" onClick = {this.removeAll}>
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
    
                            <button disabled = {isLoading} type='submit' className="ui blue basic button" tabIndex="0">
                               Save
                            </button>
                        </div>
                    </div>
                </form>
            </Transition>
        </div>
        );
    }
}

pollForm.propTypes = {
  addNewPoll: PropTypes.func.isRequired,
  fetchPoll: PropTypes.func.isRequired
};

function mapStateToProps(state, props) {
    const _id = props.match.params._id,
        poll = _id ? state.polls.find(item => item._id === _id) :null;
    return {
        user:state.auth.user,
        poll: poll
    };
}

export default connect(mapStateToProps,{ addNewPoll, fetchPoll, updatePoll })(withRouter(pollForm));
