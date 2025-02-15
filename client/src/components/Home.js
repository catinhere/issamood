import React from 'react';
import { Link } from 'react-router-dom';
import { AUTH_TOKEN } from '../utils';
import '../styles/Home.css';

function Home() {
  const authToken = localStorage.getItem(AUTH_TOKEN);
    return (
      <div id="container">
        <div id="home-section">
          <span id="title">issamood.</span>
          <div><span id="subtitle">find pics for your moods.</span></div>
          <div id="home-links">
            {authToken ? <Link to="/feed"><span className="link pink">Go to feed.</span></Link> :
              <div style={{display: 'flex'}}>
                <div style={{marginRight: '30px'}}><Link to="/signup"><span className="link pink">Sign Up</span></Link></div>
                <div style={{marginRight: '30px'}}><Link to="/login"><span className="link green">Login</span></Link></div>
                <div><a href="https://catherinekleung.com" target="_blank" rel="noopener noreferrer"><span className="link orange">Info</span></a></div>
              </div>}
          </div>
        </div>
      </div>
    ); 
}

export default Home;
