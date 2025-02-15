import React from 'react';
import LoadingGif from '../assets/loader.gif'

function Loading() {
    return (
        <div style={{textAlign: 'center', marginTop: "30vh"}}>
            <img src={LoadingGif} alt="loading"></img>
        </div>
    );
}

export default Loading;