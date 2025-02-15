import React, { Component } from 'react';
import Error from './Error';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MoodIcon from './MoodIcon';
import PostIcon from './PostIcon';
import Loading from './Loading';
import { SERVER_URI } from '../constants';
import { AUTH_TOKEN } from '../utils';
import '../styles/Feed.css';

const moods = [
    { mood: "happy", pic: "https://res.cloudinary.com/dzabih0aw/image/upload/v1572747197/issamood/moods/happy_nlqdci.png", color: "#90B672" },
    { mood: "angry", pic: "https://res.cloudinary.com/dzabih0aw/image/upload/v1572747197/issamood/moods/angry_kb1cir.png", color: "#E06262" },
    { mood: "sad", pic: "https://res.cloudinary.com/dzabih0aw/image/upload/v1572747197/issamood/moods/sad_g4pjpk.png", color: "#85B9DF" },
    { mood: "annoyed", pic: "https://res.cloudinary.com/dzabih0aw/image/upload/v1572747197/issamood/moods/judging_ucdc1w.png", color: "#9F88D0" },
    { mood: "in love", pic: "https://res.cloudinary.com/dzabih0aw/image/upload/v1572747197/issamood/moods/love_pauofz.png", color: "#D997C6" },
    { mood: "shocked", pic: "https://res.cloudinary.com/dzabih0aw/image/upload/v1572747197/issamood/moods/shocked_g8ysij.png", color: "#C6CC85" },
    { mood: "smug", pic: "https://res.cloudinary.com/dzabih0aw/image/upload/v1572747198/issamood/moods/smug_b3ixvl.png", color: "#F29662" },
    { mood: "laughing", pic: "https://res.cloudinary.com/dzabih0aw/image/upload/v1572747197/issamood/moods/laughing_jbo3zd.png", color: "#8ED0D4" },
    { mood: "tired", pic: "https://res.cloudinary.com/dzabih0aw/image/upload/v1572747198/issamood/moods/tired_shyg1b.png", color: "#8C8686" }
];

class Feed extends Component {

    constructor() {
        super();
        this.state = {
            recentPosts: [],
            popularPosts: [],
            loading: true,
            error: false
        };
    }

    componentDidMount() {
        // get recents
        let recentPosts = axios(`${SERVER_URI}posts?limit=9&sort=-createdAt`, { 
                            method: 'get',
                            withCredentials: true
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.data;
                            }
                        });

        // get popular posts
        let popularPosts = axios(`${SERVER_URI}posts?limit=9&sort=-likes`, { 
                            method: 'get',
                            withCredentials: true
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.data;
                            }
                        });

        Promise.all([recentPosts, popularPosts]).then((vals) => {
            this.setState({ recentPosts: vals[0], popularPosts: vals[1], loading: false })
        })
        .catch((err) => {
            this.setState({error: true, loading: false})
        })
    }

    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return <Error errorCode="401"/>;
        if (this.state.loading) return <Loading/>;
    
        return (
            <div id="content-container">
                <div id="moods">
                    {moods.map(mood => <Link to={`/mood/${mood.mood}`} key={mood.mood}><MoodIcon mood={mood}/></Link>)}
                </div>
                <div id="feed-content">
                    <div id="recent" className="feed-section">
                        <div className="inline-heading-section">
                            <div className="feed-heading">Recent</div>
                            <div className="sublink"><Link to={{pathname: '/posts', state: {sortBy: 'recent'}}}>see all</Link></div>
                        </div>
                        <div className="icons-section">
                            {this.state.recentPosts.map(post => <PostIcon type='feed' post={post} key={post._id}/>)}
                        </div>
                    </div>
                    <div id="popular" className="feed-section">
                        <div className="inline-heading-section">
                            <div className="feed-heading">Popular</div>
                            <div className="sublink"><Link to={{pathname: '/posts', state: {sortBy: 'popular'}}}>see all</Link></div>
                        </div>
                        <div className="icons-section">
                            {this.state.popularPosts.map(post => <PostIcon type='feed' post={post}key={post._id}/>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Feed;
