import React, {Component} from 'react';
import axios from 'axios';
import Chip from './Chip';
import Error from './Error';
import Dropzone from 'react-dropzone';
import { SERVER_URI } from '../constants';
import { AUTH_TOKEN } from '../utils';

class AddPost extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            photoUrl: '',
            tags: [],
            mood: '',
            preuploadedPhoto: '',
            uploadPicMessage: '',
            droppedPhotoName: ''
        };
        this.addPost = this.addPost.bind(this);
    }

    addPost() {
        axios(`${SERVER_URI}post`, { 
            method: 'post',
            withCredentials: true,
            data: { title: this.state.title, photoUrl: this.state.photoUrl, tags: this.state.tags.map(tag => tag.toLowerCase()), mood: this.state.mood.toLowerCase() }
          })
          .then((res) => {
            if (res.status === 200) {
                this.props.history.push(`/feed`);
            }
          })
          .catch((err) => {
            return err
          });

    }

    onDrop = async (files) => {
        // only accept one photo
        this.setState({ preuploadedPhoto: files[0], droppedPhotoName: files[0].name });
    }

    uploadPics = async () => {
        this.setState({uploadPicMessage: 'uploading...'});
        let cloudName = "dzabih0aw";
        const formData = new FormData();
        formData.append('file', this.state.preuploadedPhoto);
        formData.append('upload_preset', 'znn088j5');
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
        this.setState({photoUrl: response.data.secure_url, uploadPicMessage: 'uploaded!'});
    }

    handleTagsChange(e) {
        if (e.target.value.charAt(e.target.value.length - 1) === ',' && e.target.value !== ',') {
            let substr = e.target.value.substring(0, e.target.value.length - 1);
            e.target.value = "";
            let newArr = [...this.state.tags];
            newArr.push(substr);
            this.setState({ tags: newArr});
        }
    }

    handleDeleteTag(tagToDelete) {
        this.setState({
            tags: this.state.tags.filter(tag => tag !== tagToDelete)
        });
    }

    render() {
        const authToken = localStorage.getItem(AUTH_TOKEN);
        if (!authToken) return <Error errorCode="401"/>;
        
        return (
            <div id="form-container">
                <div className="center">
                    <h1>ADD MOOD PIC</h1>
                    <div><input type="text" placeholder="TITLE" onChange={(e) => this.setState({title: e.target.value})}></input></div>
                    <div><input type="text" placeholder="TAGS" onChange={(e) => this.handleTagsChange(e)}></input></div>
                    
                        {this.state.tags.length > 0 ? 
                            (<div style={{marginBottom: '10px'}}>
                                {this.state.tags.map(tag => 
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => this.handleDeleteTag(tag)}
                                        chipColor="#9F88D0"
                                        showDelete={true}
                                    />
                        )}</div>) : null}
                    
                    <div id="select-menu">
                        <select id="select-form" onChange={(e) => this.setState({mood: e.target.value})}>
                            <option value="" disabled selected>MOOD</option>
                            <option>Happy</option>
                            <option>Angry</option>
                            <option>Sad</option>
                            <option>Annoyed</option>
                            <option>In love</option>
                            <option>Shocked</option>
                            <option>Smug</option>
                            <option>Laughing</option>
                            <option>Tired</option>
                        </select>
                    </div>
                    <div style={{marginTop: '10px'}}>
                        <Dropzone onDrop={acceptedFiles => this.onDrop(acceptedFiles)}>
                            {({getRootProps, getInputProps}) => (
                                <section>
                                    <div {...getRootProps()} id="drop-zone">
                                        <input {...getInputProps()} />
                                        <p>Drag photo or click to browse.</p>
                                        <div style={{wordWrap: 'break-word'}}>{this.state.droppedPhotoName}</div>
                                        <div>{this.state.uploadPicMessage}</div>
                                    </div>
                                </section>
                            )}
                        </Dropzone>
                        <button className="btn outline-btn" onClick={this.uploadPics}>Upload</button>
                    </div>
                    <div style={{marginTop: '30px'}}><button onClick={this.addPost} className="btn btn-lg green-btn">Submit</button></div>
                </div>
            </div>
        )
    }
}

export default AddPost;