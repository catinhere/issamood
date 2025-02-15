import React from 'react';

function Chip(props) {
    return (
        <div className="chip" style={{ backgroundColor: props.chipColor }}>
            <span className="chip-label">{props.label}</span>
            {props.showDelete ? (<div style={{display: 'inline-block'}} onClick={props.onDelete}><i className="fas fa-times-circle"></i></div>) : null}
        </div>
    )
}

export default Chip;