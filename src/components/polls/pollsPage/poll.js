import React, { Component } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
//import classnames from 'classnames';
import {  Grid, Table, Button  } from 'semantic-ui-react'

class PollOptions extends Component {
        
        
        render(){
            const { options, _id, deletePoll } = this.props;
            
            return( 
            <Grid divided verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column width={12}>
                        <Table singleLine compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Option</Table.HeaderCell>
                                    <Table.HeaderCell>Votes</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            
                            { options.map((opt,ind) => (
                                <Table.Body key = {ind}>
                                    <Table.Row>
                                        <Table.Cell>{opt.option}</Table.Cell>
                                        <Table.Cell>{opt.votes}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                    </Grid.Column>
                
                    <Grid.Column width={4} textAlign='center'>
                        <Grid.Row><Link to = {`/newpoll/${_id}`} params={_id}><Button basic color='grey'>Edit</Button></Link></Grid.Row>
                        <br/>
                        <Grid.Row><Button basic color='red' onClick={()=>deletePoll(_id)}>Delete</Button></Grid.Row>
                        <br/>
                        <Grid.Row><Link to = {`/pollPage/${_id}`} params={_id}><Button basic color='green'>View</Button></Link></Grid.Row>

                    </Grid.Column>
                </Grid.Row>
            </Grid>

            );
        }
}

PollOptions.propTypes = {
    options: PropTypes.array.isRequired,
    _id: PropTypes.string.isRequired,
    deletePoll: PropTypes.func.isRequired
};

export default PollOptions;