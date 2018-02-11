import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, List, Grid } from 'semantic-ui-react';

const { shape, func, string, arrayOf, number } = PropTypes;


class PollOption extends Component{
    
    state = { choose:true }

    hover (e) { this.setState({choose: !this.state.choose}); }
    
    render (){
        const { props } = this;
        return( 
            <List.Item {...props}  name={ props.option }>
                <Grid.Row onMouseEnter = { this.hover.bind(this) } onMouseLeave = { this.hover.bind(this) }>
                    <Grid.Column floated='left' > 
                        { props.option } 
                    </Grid.Column>
                    <Grid.Column floated='right' hidden={this.state.choose} >
                        <Icon floated='right' name='thumbs outline up' />
                        Vote!
                    </Grid.Column>
                </Grid.Row>
            </List.Item>

        );
    }
}


PollOption.propTypes = {
  option : string.isRequired,
  onClick : func.isRequired
};


class pollCard extends Component{
    
    render(){
        
        const { _id, createdAt, owner, options, sum } = this.props, 
        
        date = /(\d{4}-\d{2}-\d{1,2}).*/.exec(createdAt)[1];
                let { question } = this.props;

        question = question.replace(question[0],question[0].toUpperCase());
        return (

            <Card raised className = 'card'>
            
                <Card.Content header={ question }
                            meta = { owner }
                            className = 'card-header'
                />
                                                            
                <Card.Content description = { 
                    <List animated selection>
                        { options.map( (opt, index) =>
                            ( <PollOption   key= {opt.option+index} 
                                            option={ opt.option } 
                                            onClick={ (e) => this.props.selectPoll(e, {_id, index}) }
                            /> )
                        )}
                    </List>        
                }/>
    
                <Card.Content extra>
                    <Grid.Row>
                        <Grid.Column floated='left'>
                            <Icon floated='right' name='hand victory' />
                             { sum } Votes
                        </Grid.Column>
                        <Grid.Column floated='right'>{ date }</Grid.Column>
                    </Grid.Row>
                </Card.Content>    
            </Card>
        );
    }
}


pollCard.propTypes = {
    _id : string,
    createdAt : string,
    question : string,
    options : arrayOf( shape({
        option : string,
        votes : number
    })),
    owner : string ,
    sum : number,
    selectPoll: func.isRequired
};


export default pollCard;

