import React from 'react';
import { Link } from 'react-router-dom';
import { CLOUDINARY_URI, FEED_ICON_IMG_TRANS_PARAMS, FOLLOWING_FEED_ICON_IMG_TRANS_PARAMS } from '../constants';

function PostIcon(props) {
    const transSizeParam = props.type === 'feed' ? FEED_ICON_IMG_TRANS_PARAMS : FOLLOWING_FEED_ICON_IMG_TRANS_PARAMS;
    return (
        <Link to={`/post/${props.post._id}`}>
            <div className="post-icon">
                <div className="post-icon-container">
                    <img className="post-icon-pic" alt="post pic" src={CLOUDINARY_URI + transSizeParam + props.post.photoUrl.split(CLOUDINARY_URI)[1]}></img>
                    <span className="post-icon-likes"><i className="far fa-heart"></i> {props.post.likedBy.length}</span>
                </div>
                <div className="post-icon-title">{props.post.title}</div>
            </div>
        </Link>
    );
}

export default PostIcon;