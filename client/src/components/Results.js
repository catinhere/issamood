import React, {Component} from 'react';
import axios from 'axios';
import Error from './Error';
import Loading from './Loading';
import PostIcon from './PostIcon';
import { SERVER_URI } from '../constants';
import { AUTH_TOKEN } from '../utils';

class Results extends Component {

    constructor() {
        super();
        this.state = {
            posts: [],
            currOffset: 0,
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

    componentDidUpdate(prevProps) {
        if (this.props.match.params.tag !== prevProps.match.params.tag) {
            this.setState({loading: true})
            this.getPosts(false);
        }
    }

    getPosts(isLoadMore) {
        const json = {tags: this.props.match.params.tag};
        const offset = isLoadMore ? `&skip=${(this.state.currOffset + 1) * 45}` : '';
        axios(`${SERVER_URI}posts?sort=-createdAt&limit=45${offset}&json=${JSON.stringify(json)}`, { 
            method: 'get',
            withCredentials: true
        })
        .then((res) => {
            if (res.status === 200) {
                this.setState({posts: isLoadMore ? [...this.state.posts, ...res.data] : res.data, query: this.props.match.params.tag, currOffset: (isLoadMore ? this.state.currOffset + 1 : this.state.currOffset), loading: false, error: false});
            }
        })
        .catch((err) => {
            this.setState({loading: false, error: true})
        });
    }

    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return <Error errorCode="401"/>;
        if (this.state.error) return <Error errorCode="404"/>;
        if (this.state.loading) return  <Loading/>;

        return (
            <div id="content-container">
                <div className="content-header">Results for: {this.props.match.params.tag}</div>
                <div id="results-container">
                    {this.state.posts.map(post => <PostIcon post={post} key={post._id} type='feed'/>)}
                </div>
            </div>
        );
    }
}

export default Results;