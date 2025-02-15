import React, { Component } from 'react';
import Error from './Error';
import axios from 'axios';
import Chip from './Chip';
import Comment from './Comment';
import PostButton from './PostButton';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { SERVER_URI } from '../constants';
import { AUTH_TOKEN, USER_ID } from '../utils';
import '../styles/Post.css';

class Post extends Component {
    constructor() {
        super();
        this.state = {
            post: '',
            user: '',
            comment: '',
            likedPost: false,
            bookmarkedPost: false,
            currUser: '',
            loading: true,
            error: false
        };
        this.postComment = this.postComment.bind(this);
        this.handleLike = this.handleLike.bind(this);
    }

    componentDidMount() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return;
        
        // get post and user data
        let postAndUserData = axios(`${SERVER_URI}post/${this.props.match.params.id}`, { 
                                method: 'get',
                                withCredentials: true
                            })
                            .then((postRes) => {
                                if (postRes.status === 200) {
                                    return postRes;
                                }
                            })
                            .then((postRes) => {
                                // get user
                                return axios(`${SERVER_URI}user/${postRes.data.user}`, { 
                                        method: 'get',
                                        withCredentials: true
                                    })
                                    .then((userRes) => {
                                        if (userRes.status === 200) {
                                            return { user: userRes.data, post: postRes.data };
                                        }
                                    });
                            });

        let currUser = axios(`${SERVER_URI}user/${localStorage.getItem(USER_ID)}`, {
                            method: 'get',
                            withCredentials: true
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.data;
                            }
                        });

        let boardsWithPost = axios(`${SERVER_URI}boards?json={"user._id":{"$eq":"${localStorage.getItem(USER_ID)}"},"posts._id":{"$eq":"${this.props.match.params.id}"}}`, {
                                method: 'get',
                                withCredentials: true,
                            })
                            .then((res) => {
                                if (res.status === 200) {
                                    return res.data;
                                }
                            });
                        
        Promise.all([currUser, postAndUserData, boardsWithPost]).then((vals) => {
            let likedPost = (vals[0].likes.filter(like => like._id === this.props.match.params.id).length === 1);
            let bookmarkedPost = vals[2].length > 0;
            this.setState({ currUser: vals[0], post: vals[1].post, user: vals[1].user, likedPost, bookmarkedPost, error: false, loading: false })
        })
        .catch((err) => {
            this.setState({ error: true, loading: false});
        })
    }

    postComment() {
        axios(`${SERVER_URI}comment`, { 
            method: 'post',
            withCredentials: true,
            data: { comment: this.state.comment, post: this.props.match.params.id }
        })
        .then((comment) => {
            if (comment.status === 200) {
                let newPost = { ...this.state.post };
                newPost.comments.push(comment.data);
                this.setState({ post: newPost, comment: '' });
                this.props.history.push(`/post/${this.props.match.params.id}`);
                return comment;
            }
        })
        .catch((err) => {
            return err;
        });
    }

    handleLike() {
        // update post's likedBy and likes
        let update = (this.state.likedPost) ? { likes: this.state.post.likes - 1, $pull: { likedBy: this.state.currUser._id }} : { likes: this.state.post.likes + 1, $push: { likedBy: this.state.currUser._id }};
        axios(`${SERVER_URI}post/${this.props.match.params.id}`, { 
            method: 'put',
            withCredentials: true,
            data: update
        })
        .then((updatedPost) => {
            if (updatedPost.status === 200) {
                // update user's liked posts
                let update = (this.state.likedPost) ? { $pull: { likes: { _id: this.props.match.params.id, photoUrl: this.state.post.photoUrl } }} : { $push: { likes: { _id: this.props.match.params.id, photoUrl: this.state.post.photoUrl } }};
                axios(`${SERVER_URI}user/${this.state.currUser._id}`, { 
                    method: 'put',
                    withCredentials: true,
                    data: update
                })
                .then((updatedUser) => {
                    if (updatedPost.status === 200) {
                        this.setState({ likedPost: !this.state.likedPost, currUser: updatedUser.data, post: updatedPost.data });
                        this.props.history.push(`/post/${this.props.match.params.id}`);
                    }
                })
                .catch((err) => {
                    return err;
                });
            }
        })
        .catch((err) => {
            return err;
        });
    }

    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return <Error errorCode="401"/>;
        if (this.state.error) return <Error errorCode="404"/>;
        if (this.state.loading) return  <Loading/>;

        return (
            <div id="content-container">
                <div className="post-container">
                    <img id="post-img" src={this.state.post.photoUrl} alt="post pic"></img>
                    <div id="post-info">
                        <div id="post-title">{this.state.post.title}</div>
                        <div className="post-inline-info">
                            {this.state.post ? (
                                <React.Fragment>
                                    <div className="post-likes-comments-count">
                                        {this.state.post ? (<span><i className="far fa-heart"></i> {this.state.post.likedBy.length}</span>) : null}
                                    </div>
                                    <div className="post-likes-comments-count">
                                        <span><i className="far fa-comment"></i> {this.state.post.comments.length}</span>
                                    </div>
                                </React.Fragment>
                            ) : null}
                        </div>
                        <div className="post-inline-info">
                            <img id="post-poster-pic" src={this.state.user.profilePic} alt="post owner profile pic"></img>
                            <Link to={`/user/${this.state.user._id}`}><span id="post-poster-username">@{this.state.user.username}</span></Link>
                        </div>
                        <div className="post-inline-info">
                            <PostButton onClick={this.handleLike} shouldHighlight={this.state.likedPost} highlightClass="liked" val={(<i className="fas fa-heart"></i>)} />
                            <PostButton onClick={() => this.props.history.push(`/post/${this.props.match.params.id}/bookmark`)} shouldHighlight={this.state.bookmarkedPost} highlightClass="bookmarked" val={(<i className="fas fa-bookmark"></i>)} />
                            <PostButton onClick={null} val={(<i className="fas fa-share"></i>)} />
                        </div>
                        <div className="post-inline-info">
                            <div className="heading">Mood</div>
                            <div id="mood"><Link to={`/mood/${this.state.post.mood}`}>{this.state.post.mood}</Link></div>
                        </div>
                        <div id="tags-section" style={{width: '25vw'}}>
                            <div id="tags-heading" className="heading">Tags</div>
                            <div style={{display: 'flex', flexWrap: 'wrap', marginTop: '10px'}}>
                                {this.state.post ? this.state.post.tags.map(tag => <Link to={`/results/${tag}`} key={tag}><Chip label={tag} chipColor="#C6CC85"/></Link>) : null}
                            </div>
                        </div>
                    </div>
                </div>
                <div id="comments-container">
                    <div id="comments-section">
                        <div><span className="heading">Comments</span></div>
                        {this.state.post ? (
                            <div id="comments">
                                {this.state.post.comments.map((comment) => {
                                    return (<Comment comment={comment}/>);
                                })}
                            </div>
                        ) : null}
                        <div style={{display: 'flex', marginTop: '30px', alignItems: 'center'}}>
                            <textarea id="comment-text-input" rows="2" cols="100" placeholder="ADD A COMMENT..." value={this.state.comment} onChange={(e) => this.setState({ comment: e.target.value })}></textarea>
                            <button onClick={this.postComment} className="btn btn-lg pink-btn" style={{color: 'white', borderRadius: '5px'}}>Post</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Post);