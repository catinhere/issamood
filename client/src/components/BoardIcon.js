import React from 'react';
import { CLOUDINARY_URI, PROFILE_BOARD_ICON_TRANS_PARAMS } from '../constants';

function BoardIcon(props) {
    let picStyle = props.selected === null || !props.selected ? {} : { opacity: '70%' };
    return (
        <div className="board-icon">
            <div className="board-icon-container" onClick={props.onClick != null ? () => props.onClick(props.board, props.selected) : null}>
                <img className="board-icon-pic" alt="board cover" style={picStyle} src={props.board.posts.length > 0 ? CLOUDINARY_URI + PROFILE_BOARD_ICON_TRANS_PARAMS + props.board.posts[0].photoUrl.split(CLOUDINARY_URI)[1] : "https://res.cloudinary.com/dzabih0aw/image/upload/c_thumb,h_144,w_330/v1573074822/issamood/board-icon-placeholder_mnoc2w.png"}></img>
                <span className="board-icon-title">{props.board.title}</span>
                <span className="board-icon-info">{`${props.board.posts.length} ${props.board.posts.length === 1 ? 'post ' : 'posts '} ${props.board.followers.length} followers`}</span>
            </div> 
        </div>
    );
}

export default BoardIcon;