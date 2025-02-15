import React, { Component } from 'react';
import axios from 'axios';
import Error from './Error';
import Loading from './Loading';
import { Link } from 'react-router-dom';
import { SERVER_URI } from '../constants';
import { AUTH_TOKEN, USER_ID } from '../utils';

class Likes extends Component {

    constructor() {
        super();
        this.state = {
            likedPosts: [],
            loading: true,
            error: false
        };
    }

    componentDidMount() {
        axios(`${SERVER_URI}user/${localStorage.getItem(USER_ID)}`, { 
            method: 'get',
            withCredentials: true
        })
        .then((res) => {
            if (res.status === 200) {
                this.setState({likedPosts: res.data.likes, loading: false, error: false});
            }
        })
        .catch((err) => {
            this.setState({loading: false, error: true});
        });
    }

    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return <Error errorCode="401"/>;
        if (this.state.error) return <Error errorCode="404"/>;
        if (this.state.loading) return  <Loading/>;
    
        return (
            <div id="content-container">
                <div>
                    <h1>LIKES</h1>
                    <div id="likes-container">
                        {this.state.likedPosts.map(post => <div key={post._id}><Link to={`/post/${post._id}`}><img className="profile-post-icon" alt="post icon" src={post.photoUrl} /></Link></div> )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Likes;
