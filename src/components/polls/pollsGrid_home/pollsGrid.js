import React from 'react';
import PollCard from './pollCard';

export default ({ polls, selectPoll }) => {
    return (
        <div className = 'cardsGrid'>
            <div className = 'cardsRow'>
                 { polls.map( ( poll,index ) =>{
                    return (<PollCard   
                                { ...poll } 
                                key = { poll.owner + index }
                                selectPoll = {selectPoll}
                    />)
                  })}
            </div>
        </div>
    );
}

