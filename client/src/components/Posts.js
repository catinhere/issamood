import React, { Component } from 'react';
import axios from 'axios';
import PostIcon from './PostIcon';
import Error from './Error';
import Loading from './Loading';
import { SERVER_URI } from '../constants';
import { AUTH_TOKEN } from '../utils';

class Posts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sortBy: props.location.state.sortBy,
            posts: [],
            currOffset: 0,
            error: false,
            loading: true
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

    componentDidUpdate(prevProps, prevState) {
        if (this.state.sortBy !== prevState.sortBy) {
            this.getPosts(false);
        }
    }

    getPosts(isLoadMore) {
        const params = this.state.sortBy === 'recent' ? 'sort=-createdAt' : 'sort=-likes';
        const offset = isLoadMore ? `&skip=${(this.state.currOffset + 1) * 45}` : '';
        axios(`${SERVER_URI}posts?${params}&limit=45${offset}`, { 
            method: 'get',
            withCredentials: true
        })
        .then((res) => {
            if (res.status === 200) {
                this.setState({posts: isLoadMore ? [...this.state.posts, ...res.data] : res.data, sortBy: this.state.sortBy, currOffset: (isLoadMore ? this.state.currOffset + 1 : 0), loading: false, error: false});
            }
        })
        .catch((err) => {
            this.setState({loading: false, error: true});
        });
    }

    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return (<div>404</div>);
        if (this.state.error) return <Error errorCode="404"/>;
        if (this.state.loading) return  <Loading/>;
    
        return (
            <div id="content-container">
                <div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                        <div><h1>ALL POSTS</h1></div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div className="select-label">SORT BY</div>
                            <div>
                                <select onChange={(e) => this.setState({sortBy: e.target.value})} value={this.state.sortBy}>
                                    <option value="recent">Recent</option>
                                    <option value="popular">Popular</option>
                                </select>
                            </div>
                            
                        </div>
                    </div>
                    <div id="results-container">
                        {this.state.posts.map(post => <PostIcon key={post._id} type='feed' post={post} /> )}
                    </div>
                </div>
            </div>
        );
    }
}

export default Posts;
