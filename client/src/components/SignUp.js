import React, {Component} from 'react';
import axios from 'axios';
import { SERVER_URI } from '../constants';
import { saveToken, saveUserId } from '../utils';

class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            email: '',
            password: '',
            errorMessage: ''
        };
        this.signup = this.signup.bind(this);
    }

    signup() {
        axios.post(`${SERVER_URI}user`, { username: this.state.username, password: this.state.password, email: this.state.email }) //https://cors-anywhere.herokuapp.com/https://google.com
            .then((res) => {
                saveToken(res.data.token);
                saveUserId(res.data.user._id);
                this.props.history.push(`/`);
            })
            .catch((err) => {
                this.setState({ errorMessage: err.response.data.message });
            });
    }

    render() {
        return (
            <div id="container">
                <div id="home-section">
                    <div style={{marginBottom: '20px'}}><span id="title">SIGN UP</span></div>
                    <div>
                        <div><input onChange={(e) => this.setState({username: e.target.value})} type="text" placeholder="USERNAME"></input></div>
                        <div><input onChange={(e) => this.setState({email: e.target.value})} type="text" placeholder="EMAIL"></input></div>
                        <div><input onChange={(e) => this.setState({password: e.target.value})} type="password" placeholder="PASSWORD"></input></div>
                    </div>
                    <div className="error-msg">{this.state.errorMessage}</div>
                    <div>
                        <button onClick={this.signup} className="btn btn-lg pink-btn">Sign Up</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;