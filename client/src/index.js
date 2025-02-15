import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import { SERVER_URI } from './constants';
import Home from './components/Home';
import Feed from './components/Feed';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Post from './components/Post';
import AddPost from './components/AddPost';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Bookmark from './components/Bookmark';
import Likes from './components/Likes';
import Mood from './components/Mood';
import Board from './components/Board';
import Following from './components/Following';
import Results from './components/Results';
import Posts from './components/Posts';
import Error from './components/Error';
import axios from 'axios';
import { USER_ID } from './utils';
import * as serviceWorker from './serviceWorker';
import { inject } from '@vercel/analytics';

inject();

const NoMatchPage = () => {
    return (
        <Error errorCode='404'/>
    );
};

class NavBarWindowContainer extends Component {
    constructor() {
        super();
        this.state = {
            profilePic: ''
        };
    }
    
    componentDidMount() {
        const userId = localStorage.getItem(USER_ID);
        axios(`${SERVER_URI}user/${userId}`, { 
            method: 'get',
            withCredentials: true 
          })
          .then((res) => {
            if (res.status === 200) {
                this.setState({ profilePic: res.data.profilePic });
            }
          })
          .catch((err) => {
            return err
          });
    }

    render() {
        return (
            <div>
                <Navbar photoUrl={this.state.profilePic} />
                <Switch>
                    <Route exact path="/feed" component={Feed} />
                    <Route exact path="/user/:id" render={() => <Profile changePic={(url) => this.setState({profilePic: url})} />} />
                    <Route exact path="/post/:id" component={Post} />
                    <Route exact path="/addPost" component={AddPost} />
                    <Route exact path="/post/:id/bookmark" component={Bookmark} />
                    <Route exact path="/likes" component={Likes} />
                    <Route exact path="/mood/:mood" component={Mood} />
                    <Route exact path="/board/:id" component={Board} />
                    <Route exact path="/following" component={Following} />
                    <Route exact path="/results/:tag" component={Results} />
                    <Route exact path="/posts" component={Posts} />
                    <Route component={NoMatchPage} />
                </Switch>
            </div>
        )
    }
}

const DefaultContainer = () => (
    <NavBarWindowContainer/>
);

const routing = (
    <Router>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/login" component={Login} />
            <Route component={DefaultContainer}/>
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
