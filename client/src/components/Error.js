import React from 'react';
import { Link } from 'react-router-dom';
import { AUTH_TOKEN } from '../utils';

const errorMap = {
    '401': {
        imageUrl: 'https://res.cloudinary.com/dzabih0aw/image/upload/v1572747197/issamood/moods/sad_g4pjpk.png',
        message: 'not authorized',
        linkLabel: 'Login',
        linkClassName: 'green',
        link: '/login'
    },
    '404': {
        imageUrl: 'https://res.cloudinary.com/dzabih0aw/image/upload/v1572747197/issamood/moods/shocked_g8ysij.png',
        message: 'page not found',
        linkLabel: !localStorage.getItem(AUTH_TOKEN) ? 'Go home' : 'Go to feed',
        linkClassName: 'pink',
        link: !localStorage.getItem(AUTH_TOKEN) ? '/' : '/feed'
    }
};

function Error(props) {
    return (
        <div id="container">
            <div id="error-section">
                <div><img style={{height: '130px', width: '130px'}} alt="error pic" src={errorMap[props.errorCode].imageUrl}></img></div>
                <div style={{fontWeight: '700', fontSize: '50px'}}>{props.errorCode}</div>
                <div>{errorMap[props.errorCode].message}</div>
                <div><Link className={`link ${errorMap[props.errorCode].linkClassName}`} to={errorMap[props.errorCode].link}>{errorMap[props.errorCode].linkLabel}</Link></div>
            </div>
        </div>
    );
}

export default Error;