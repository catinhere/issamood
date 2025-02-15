import React from 'react';
import { withRouter } from 'react-router';

function MoodIcon(props) {
    return (
        <div className="mood-icon" style={{backgroundColor: props.mood.color}}>
            <div><img className="mood-pic" alt="mood icon" src={props.mood.pic}></img></div>
            <div className="mood-label"><span className="mood">{props.mood.mood}</span></div>
        </div>
    );
}

export default withRouter(MoodIcon);