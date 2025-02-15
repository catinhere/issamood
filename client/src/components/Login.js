import React, {Component} from 'react';
import axios from 'axios';
import { SERVER_URI } from '../constants';
import { saveToken, saveUserId, saveTimestamp, handleEnter } from '../utils';
import '../styles/Common.css';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errorMessage: ''
        };
        this.login = this.login.bind(this);
    }

    login() {
        axios.post(`${SERVER_URI}login`, { username: this.state.username, password: this.state.password }, { withCredentials: true, headers: {'Content-Type': 'application/json'}})
            .then((res) => {
                saveToken(res.data.token);
                saveUserId(res.data.user._id);
                saveTimestamp();
                this.props.history.push(`/feed`);
            })
            .catch((err) => {
                this.setState({ errorMessage: err.response.data.message });
                return err;
            });
    }

    render() {
        return (
            <div id="container">
                <div id="home-section">
                    <div style={{marginBottom: '20px'}}><span id="title">LOGIN</span></div>
                    <div>
                        <div><input onChange={(e) => this.setState({username: e.target.value})} onKeyPress={(e) => handleEnter(e, this.login)} type="text" placeholder="USERNAME"></input></div>
                        <div><input onChange={(e) => this.setState({password: e.target.value})} onKeyPress={(e) => handleEnter(e, this.login)} type="password" placeholder="PASSWORD"></input></div>
                    </div>
                    <div className="error-msg">{this.state.errorMessage}</div>
                    <div>
                        <button onClick={this.login} className="btn btn-lg green-btn">Login</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;