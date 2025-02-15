import React, {Component} from 'react';
import axios from 'axios';
import Error from './Error';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import { SERVER_URI } from '../constants';
import { AUTH_TOKEN, USER_ID } from '../utils';
import "../styles/Board.css";

class Board extends Component {
    constructor() {
        super();
        this.state = {
            board: '',
            posts: [],
            isFollowing: false,
            currUser: '',
            error: false,
            loading: true
        };

        this.handleFollowUnfollow = this.handleFollowUnfollow.bind(this);
    }

    componentDidMount() {
        const currUserId = localStorage.getItem(USER_ID);
        let boardData = axios(`${SERVER_URI}board/${this.props.match.params.id}`, {
                            method: 'get',
                            withCredentials: true
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.data;
                            }
                        });

        let currUserData = axios(`${SERVER_URI}user/${currUserId}`, {
                                method: 'get',
                                withCredentials: true
                            })
                            .then((res) => {
                                if (res.status === 200) {
                                    return res.data;
                                }
                            });

        Promise.all([boardData, currUserData]).then((vals) => {
            const isFollowing = vals[0].followers.includes(currUserId);
            this.setState({ board: vals[0], posts: vals[0].posts.reverse(), currUser: vals[1], isFollowing, error: false, loading: false });
        })
        .catch((err) => {
            this.setState({ error: true, loading: false});
        })
    }

    handleFollowUnfollow() {
        // if following, remove board _id from curruser's followedBoards, remove curruser from board's followers
        // if not following, add board_id to curruser's followedBoards, add curruser to board's followers
        const currUserData = this.state.isFollowing ? { $pull: { followedBoards: { _id: this.state.board._id }}} : { $push: { followedBoards: { _id: this.state.board._id, title: this.state.board.title } }};
        const boardData = this.state.isFollowing ? {$pull: {followers: {_id: this.state.currUser._id}}} : {$push: {followers: { _id: this.state.currUser._id, username: this.state.currUser.username }}};

        // update curruser's followedBoards
        let currUserUpdate = axios(`${SERVER_URI}user/${this.state.currUser._id}`, { 
                            method: 'put',
                            withCredentials: true,
                            data: currUserData
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.data;
                            }
                        })
                        .catch((err) => {
                            return err
                        });

        // update board's followers
        let boardUpdate = axios(`${SERVER_URI}board/${this.state.board._id}`, {
                            method: 'put',
                            withCredentials: true,
                            data: boardData
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.data;
                            }
                        })
                        .catch((err) => {
                            return err;
                        });

        Promise.all([currUserUpdate, boardUpdate]).then((vals) => {
            this.setState({ currUser: vals[0], board: vals[1], isFollowing: !this.state.isFollowing });
        });
    }

    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return <Error errorCode="401"/>;
        if (this.state.error) return <Error errorCode="404"/>;
        if (this.state.loading) return <Loading/>;

        return (
            <div id="content-container">
                <div className="profile-container" style={{padding: '20px'}}>
                    {this.state.posts.length > 0 ? <img id="profile-pic" alt="profile pic" src={this.state.posts[this.state.posts.length - 1].photoUrl}></img> : null}
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <span style={{textTransform: 'uppercase', width: 'auto', fontSize: '17px', fontWeight: '700', marginRight: '15px'}}>{this.state.board.title}</span>
                            <div>
                                {this.state.currUser && this.state.board && (this.state.currUser._id === this.state.board.user._id) ? 
                                    null
                                    : (this.state.isFollowing ? 
                                        <button id="following-btn" onClick={this.handleFollowUnfollow} className="post-button">Following</button> 
                                        : <button id="follow-btn" onClick={this.handleFollowUnfollow} className="post-button">Follow</button>
                                    )
                                }
                            </div>
                        </div>
                        <div>{this.state.board.user ? <div>by <Link to={`/user/${this.state.board.user._id}`}><span id="board-username">@{this.state.board.user.username}</span></Link></div> : null}</div>
                        <div>
                            {this.state.board ? 
                                <div>
                                    <span className="board-info">{`${this.state.board.posts.length} ${this.state.board.posts.length === 1 ? 'post' : 'posts'}`}</span>
                                    <span className="board-info">{`${this.state.board.followers.length} ${this.state.board.followers.length === 1 ? 'follower' : 'followers'}`}</span>
                                </div> : null}
                        </div>
                    </div>
                </div>
                <div className="profile-container">
                    <div id="posts-container">
                        {this.state.posts.map(post => <Link to={`/post/${post._id}`}><img className="profile-post-icon" alt="post icon" src={post.photoUrl}></img></Link>)}
                    </div>
                </div>
            </div>
        )
    }
}

export default Board;