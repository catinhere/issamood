import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Comment.css';

function Comment(props) {
    return (
        <div className="comment-container">
            <div><img className="comment-user-pic" alt="user pic" src={props.comment.user.profilePic}></img></div>
            <div className="comment-content">
                <div><Link to={`/user/${props.comment.user._id}`}><span className="comment-user-name">@{props.comment.user.username}</span></Link></div>
                <div><span className="comment">{props.comment.comment}</span></div>
            </div>
        </div>
    );
}

export default Comment;