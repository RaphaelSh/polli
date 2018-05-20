import React from 'react';
import PollCard from './pollCard';
import { Grid } from 'semantic-ui-react';


export default ({ polls, selectPoll }) => {
    
    
    
    return polls.map( ( poll,index ) => {
        ( <PollCard   
                { ...poll } 
                key = { poll.owner + index }
                selectPoll = {selectPoll}
            /> )
    }) 
}

