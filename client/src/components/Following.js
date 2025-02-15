import React, { Component } from 'react';
import Error from './Error';
import Loading from './Loading'
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostIcon from './PostIcon';
import { SERVER_URI } from '../constants';
import { AUTH_TOKEN, USER_ID } from '../utils';
import '../styles/Following.css';

class Following extends Component {

    constructor() {
        super();
        this.state = {
            posts: [],
            following: [],
            followedBoards: [],
            currOffset: 0,
            loading: true,
            error: false
        };

        this.getMorePosts = this.getMorePosts.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', () => {
            var d = document.documentElement;
            var offset = d.scrollTop + window.innerHeight;
            var height = d.offsetHeight;

            if (offset === height) {
                this.getMorePosts();
            }
        });

        const userId = localStorage.getItem(USER_ID);
        let currUser = null;

        axios(`${SERVER_URI}user/${userId}`, { 
            method: 'get',
            withCredentials: true
        })
        .then((res) => {
            if (res.status === 200) {
                currUser = res.data;
                const json = {
                    $or: [
                        { 'user': { $in: res.data.following.map(user => user._id) }},
                        { 'inBoards._id': { $in: res.data.followedBoards.map(board => board._id) }}
                    ]
                };
                
                return axios(`${SERVER_URI}posts?limit=45&sort=-createdAt&json=${JSON.stringify(json)}`);
            }
        })
        .then((res) => {
            this.setState({ posts: res.data, following: currUser.following, followedBoards: currUser.followedBoards, error: false, loading: false });
        })
        .catch((err) => {
            this.setState({error: true, loading: false})
        });
    }

    getMorePosts() {
        const json = {
            $or: [
                { 'user': { $in: this.state.following.map(user => user._id) }},
                { 'inBoards._id': { $in: this.state.followedBoards.map(board => board._id) }}
            ]
        };

        axios(`${SERVER_URI}posts?limit=45&skip=${(this.state.currOffset + 1) * 45}&sort=-createdAt&json=${JSON.stringify(json)}`, { 
            method: 'get',
            withCredentials: true
        })
        .then((res) => {
            if (res.status === 200) {
                this.setState({posts: [...this.state.posts, ...res.data], currOffset: this.state.currOffset + 1})
            }
        })
        .catch((err) => {
            return err
        });
    }

    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return <Error errorCode="401"/>;
        if (this.state.error) return <Error errorCode="404"/>;
        if (this.state.loading) return  <Loading/>;
    
        return (
            <div id="content-container">
                <div style={{display: 'flex'}}>
                    <div id="following-container">
                        <div className="following-heading">FOLLOWING</div>
                        <div style={{marginBottom: '30px'}}>
                            <div><span className="subheading">Users</span></div>
                            {this.state.following.map(user => 
                                <div key={user._id}><Link to={`/user/${user._id}`}><span className="following-link">@{user.username}</span></Link></div>
                            )}
                        </div>
                        <div>
                            <div><span className="subheading">Boards</span></div>
                            {this.state.followedBoards.map(board => 
                                <div key={board._id}><Link to={`/board/${board._id}`}><span className="following-link">{board.title}</span></Link></div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="following-heading">Following Feed</div>
                        <div id="following-feed-container">
                            {this.state.posts.map(post => (
                                <div key={post._id}><PostIcon type='following' post={post}/></div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default Following;
