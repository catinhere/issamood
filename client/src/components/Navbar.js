import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { SERVER_URI } from '../constants';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import { AUTH_TOKEN, USER_ID, removeToken, removeUserId, removeTimestamp, handleEnter } from '../utils';
import '../styles/Navbar.css';

class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            query: ''
        }

        this.logout = this.logout.bind(this);
    }

    logout() {
        axios(`${SERVER_URI}logout`, { 
            method: 'get',
            withCredentials: true 
          })
          .then((res) => {
            if (res.status === 200) {
                removeToken();
                removeUserId();
                removeTimestamp();
                localStorage.clear();
                this.props.history.push(`/`);
            }
          })
          .catch((err) => {
            return err
          });
    }

    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return null;

        const userId = localStorage.getItem(USER_ID);
        return (
            <div id="navbar">
                <div><Link to="/feed"><span id="logo">ISSAMOOD</span></Link></div>
                <div style={{display: 'inline-flex', alignItems: 'center'}}>
                    <div id="search-bar" className="nav-item">
                        <input id="search-input" onChange={(e) => this.setState({query: e.target.value})}
                                                 onKeyPress={(e) => handleEnter(e, () => {
                                                     if (this.state.query !== '') {
                                                        e.target.value = '';
                                                        this.props.history.push(`/results/${this.state.query.toLowerCase()}`);
                                                        this.setState({query:''})
                                                     }
                                                 })} 
                                                 type="text"
                                                 autoComplete="off"
                        >
                        </input>
                        <SearchIcon id="search-icon" />
                    </div>
                    <div className="nav-item"><Link to="/addPost"><AddIcon /></Link></div>
                    <div className="nav-item"><Link to="/likes"><FavoriteBorderIcon /></Link></div>
                    <div className="nav-item" style={{display: 'flex'}}>
                        <Link to={`/user/${userId}`}><img id="nav-profile-icon" alt="profile icon" src={this.props.photoUrl}></img></Link>
                        <div id="dropdown-section">
                            <ArrowDropDownIcon className="arrow-dropdown-btn"/>
                            <div className="dropdown-content">
                                <Link to='/following'>
                                    <div className="inline-link">
                                        <div className="link-icon"><i className="far fa-newspaper"></i></div>
                                        <div className="link-label">Following</div>
                                    </div>
                                </Link>
                                <Link to={`/user/${userId}`}>
                                    <div className="inline-link">
                                        <div className="link-icon"><i className="far fa-user"></i></div>
                                        <div className="link-label">My Profile</div>
                                    </div>
                                </Link>
                                <div className="inline-link" onClick={this.logout}>
                                    <div className="link-icon"><i className="fas fa-sign-out-alt"></i></div>
                                    <div className="link-label">Logout</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Navbar);