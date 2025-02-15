import React from 'react';
import '../styles/Post.css';

function PostButton(props) {
    return (
        <button onClick={() => props.onClick !== null ? props.onClick() : null} className={`btn post-button ${props.shouldHighlight ? props.highlightClass : null}`}>
            {props.val}
        </button>
    );
}

export default PostButton;