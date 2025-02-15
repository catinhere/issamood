import React, { Component } from 'react';
import axios from 'axios';
import Error from './Error';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import BoardIcon from './BoardIcon';
import Loading from './Loading';
import { withRouter } from 'react-router';
import { SERVER_URI } from '../constants';
import { AUTH_TOKEN, USER_ID } from '../utils';
import '../styles/Profile.css';

class Profile extends Component {

    constructor() {
        super();
        this.state = {
            user: '',
            usersPosts: [],
            usersBoards: [],
            currSection: 'Posts',
            currUser: '',
            isFollowing: false,
            showPicUpload: false,
            uploadPicMessage: '',
            preuploadedPhoto: '',
            droppedPhotoName: '',
            photoUrl: '',
            loading: true,
            error: false
        };

        this.handleContentBtnClick = this.handleContentBtnClick.bind(this);
        this.handleFollowUnfollow = this.handleFollowUnfollow.bind(this);
        this.getInfo = this.getInfo.bind(this);
    }

    componentDidMount() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return;

        this.getInfo();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.getInfo();
        }
    }

    getInfo() {
        // get user
        let userData = axios(`${SERVER_URI}user/${this.props.match.params.id}`, { 
            method: 'get',
            withCredentials: true
        })
        .then((res) => {
            if (res.status === 200) {
                return res.data;
            }
        })
        .catch((err) => {
            return err
        });

        // get user's posts
        let usersPosts = axios(`${SERVER_URI}posts?sort=-createdAt&user=${this.props.match.params.id}`, {
                method: 'get',
                withCredentials: true
            })
            .then((res) => {
                if (res.status === 200) {
                    return res.data;
                }
            })

        // get boards
        let usersBoards = axios(`${SERVER_URI}boards?sort=-updatedAt&json={"user._id": {"$eq": "${this.props.match.params.id}"}}`, {
                method: 'get',
                withCredentials: true
            })
            .then((res) => {
                if (res.status === 200) {
                    return res.data;
                }
            })

        // get current user
        let currUser = axios(`${SERVER_URI}user/${localStorage.getItem(USER_ID)}`, { 
                method: 'get',
                withCredentials: true
            })
            .then((res) => {
                if (res.status === 200) {
                    return res.data;
                }
            })
            
        Promise.all([userData, usersPosts, usersBoards, currUser]).then((vals) => {
            const isFollowing = vals[3].following.filter(user => user._id === this.props.match.params.id).length === 1;
            this.setState({ user: vals[0], usersPosts: vals[1], usersBoards: vals[2], currUser: vals[3], isFollowing, loading: false });
        })
        .catch((err) => {
            this.setState({ error: true, loading: false});
        })
    }

    onDrop = async (files) => {
        // only accept one photo
        this.setState({ preuploadedPhoto: files[0], droppedPhotoName: files[0].name });
    }

    uploadPics = async () => {
        this.setState({uploadPicMessage: 'uploading...'});
        let cloudName = "dzabih0aw";
        const formData = new FormData();
        formData.append('file', this.state.preuploadedPhoto);
        formData.append('upload_preset', 'znn088j5');
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);

        axios(`${SERVER_URI}user/${this.props.match.params.id}`, { 
            method: 'put',
            withCredentials: true,
            data: { profilePic: response.data.url }
        })
        .then((res) => {
            this.setState({user: res.data, uploadPicMessage: 'uploaded!'});
            this.props.changePic(response.data.secure_url);
        })
        .catch((e) => {
            console.log(e);
        })
    }

    handleFollowUnfollow() {
        // if following, remove user from curruser's following, remove curruser from user's followers
        // if not following, add user to curruser's following, add curruser to user's followers
        const currUserFollowingData = this.state.isFollowing ? { $pull: { following: { _id: this.state.user._id }}} : { $push: { following: { _id: this.state.user._id, username: this.state.user.username, profilePic: this.state.user.profilePic } }};
        const userFollowersData = this.state.isFollowing ? {$pull: {followers: {_id: this.state.currUser._id}}} : {$push: {followers: { _id: this.state.currUser._id, username: this.state.currUser.username, profilePic: this.state.currUser.profilePic }}};

        // update curruser's following
        let currUserUpdate = axios(`${SERVER_URI}user/${this.state.currUser._id}`, { 
                            method: 'put',
                            withCredentials: true,
                            data: currUserFollowingData
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.data;
                            }
                        })
                        .catch((err) => {
                            return err
                        });

        // update user's followers
        let userUpdate = axios(`${SERVER_URI}user/${this.state.user._id}`, {
                            method: 'put',
                            withCredentials: true,
                            data: userFollowersData
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.data;
                            }
                        })
                        .catch((err) => {
                            return err;
                        });

        Promise.all([currUserUpdate, userUpdate]).then((vals) => {
            this.setState({ currUser: vals[0], user: vals[1], isFollowing: !this.state.isFollowing });
        });
    }

    handleContentBtnClick(e) {
        const clicked = e.target.innerHTML;
        const clickedElem = document.getElementById(`${clicked.toLowerCase()}-btn`);
        const currSectionElem = document.getElementById(`${this.state.currSection.toLowerCase()}-btn`);

        currSectionElem.classList.remove('green');
        clickedElem.classList.add('green');

        this.setState({ currSection: clicked });
    }

    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return <Error errorCode="401"/>;
        if (this.state.error) return <Error errorCode="404"/>;
        if (this.state.loading) return <Loading/>;

        return (
            <div id="content-container">
                <div className="profile-container">
                    <div>
                        <img id="profile-pic" src={this.state.user.profilePic} alt="profile pic"></img>
                    </div>
                    <div>
                        <div id="profile-user-line">
                            {this.state.user ? <span id="username">@{this.state.user.username}</span> : null}
                            {this.state.currUser._id === this.props.match.params.id ? 
                                <span onClick={() => this.setState({showPicUpload: !this.state.showPicUpload})} id="edit-profile-link">Edit Profile</span>
                                : (this.state.isFollowing ? 
                                    <button id="following-btn" onClick={this.handleFollowUnfollow} className="post-button">Following</button> 
                                    : <button id="follow-btn" className="post-button" onClick={this.handleFollowUnfollow}>Follow</button>
                                )
                            }
                        </div>
                        <div id="profile-nums">
                            <div className="profile-num-section">
                                <div className="profile-num">{this.state.usersPosts.length}</div>
                                <div><span className="profile-num-label">posts</span></div>
                            </div>
                            <div className="profile-num-section">
                                <div className="profile-num">{this.state.user ? this.state.user.followers.length : null}</div>
                                <div><span className="profile-num-label">followers</span></div>
                            </div>
                            <div className="profile-num-section">
                                <div className="profile-num">{this.state.user ? this.state.user.following.length : null}</div>
                                <div><span className="profile-num-label">following</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.showPicUpload ? (
                    <div className="profile-container" style={{display: 'flex', flexDirection: 'column', marginTop: '50px'}}>
                        <Dropzone onDrop={acceptedFiles => this.onDrop(acceptedFiles)}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div {...getRootProps()} id="drop-zone">
                                        <input {...getInputProps()} />
                                        <p>Drag photo or click to browse.</p>
                                        <div style={{wordWrap: 'break-word'}}>{this.state.droppedPhotoName}</div>
                                        <div>{this.state.uploadPicMessage}</div>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                        <div>
                            <button className="outline-btn" onClick={this.uploadPics}>Upload</button>
                            <button className="outline-btn" onClick={() => this.setState({showPicUpload: !this.state.showPicUpload})}>Close</button>
                        </div>
                        
                    </div>
                ) : null}
                <div className="profile-container" style={{marginTop: '50px'}}>
                    <div id="profile-btns-section">
                        <div><span id="posts-btn" onClick={(e) => this.handleContentBtnClick(e)} className="profile-content-btn green">Posts</span></div>
                        <div><span id="boards-btn" onClick={(e) => this.handleContentBtnClick(e)} className="profile-content-btn">Boards</span></div>
                    </div>
                </div>
                <div className="profile-container">
                    { this.state.currSection === 'Boards' ? 
                        (<div id="boards-container">{this.state.usersBoards.map(board => <Link to={`/board/${board._id}`} key={board._id}><BoardIcon board={board}/></Link>)}</div>)
                        : 
                        (<div id="posts-container">{this.state.usersPosts.map(post => <Link to={`/post/${post._id}`} key={post._id}><img className="profile-post-icon" src={post.photoUrl} alt=""></img></Link>)}</div>)
                    }
                </div>
            </div>
        );
    }
}

export default withRouter(Profile);