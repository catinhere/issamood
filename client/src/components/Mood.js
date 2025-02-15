import React, { Component } from 'react';
import axios from 'axios';
import Error from './Error';
import PostIcon from './PostIcon';
import Loading from './Loading';
import { SERVER_URI } from '../constants';
import { AUTH_TOKEN } from '../utils';

class Mood extends Component {

    constructor() {
        super();
        this.state = {
            posts: [],
            mood: '',
            loading: true,
            error: false
        };

        this.getPosts = this.getPosts.bind(this);
    }

    componentDidMount() {
        // add event listener for scroll
        window.addEventListener('scroll', () => {
            var d = document.documentElement;
            var offset = d.scrollTop + window.innerHeight;
            var height = d.offsetHeight;

            if (offset === height) {
                this.getPosts(true);
            }
        });

        this.getPosts(false);
    }

    getPosts(isLoadMore) {
        const mood = this.props.match.params.mood.split("-").join(" ");
        const offset = isLoadMore ? `&skip=${(this.state.currOffset + 1) * 45}` : '';
        axios(`${SERVER_URI}posts?mood=${mood}&limit=45${offset}&sort=-createdAt`, { 
            method: 'get',
            withCredentials: true
        })
        .then((res) => {
            if (res.status === 200) {
                this.setState({posts: isLoadMore ? [...this.state.posts, ...res.data] : res.data, mood, currOffset: isLoadMore ? this.state.currOffset + 1 : 0, loading: false, error: false});
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
                <div id="results-section">
                    <h1>{this.state.mood}</h1>
                    <div id="results-container" style={{justifyContent: 'flex-start'}}>
                        {this.state.posts.map(post => <PostIcon key={post._id} type='feed' post={post} /> )}
                    </div>
                </div>
        );
    }
}

export default Mood;
