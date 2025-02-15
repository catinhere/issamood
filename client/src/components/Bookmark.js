import React, {Component} from 'react';
import axios from 'axios';
import BoardIcon from './BoardIcon';
import { Link } from 'react-router-dom';
import { SERVER_URI } from '../constants';
import { USER_ID } from '../utils';

class Bookmark extends Component {
    constructor() {
        super();
        this.state = {
            post: '',
            showCreateNewBoard: false,
            boards: [],
            boardTitle: '',
            currUser: ''
        };
        this.handleCreate = this.handleCreate.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        const userId = localStorage.getItem(USER_ID);

        let post = axios(`${SERVER_URI}post/${this.props.match.params.id}`, {
                    method: 'get',
                    withCredentials: true
                })
                .then((res) => {
                    if (res.status === 200) {
                        return res.data;
                    }
                })
                .catch((err) => {
                    return err;
                });

        let boards = axios(`${SERVER_URI}boards?sort=-updatedAt`, {
                        method: 'get',
                        withCredentials: true,
                        data: {user: {_id: userId}}
                    })
                    .then((res) => {
                        if (res.status === 200) {
                            return res.data;
                        }
                    })
                    .catch((err) => {
                        return err;
                    });

        let currUser = axios(`${SERVER_URI}user/${userId}`, {
                            method: 'get',
                            withCredentials: true
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.data;
                            }
                        })
                        .catch((err) => {
                            return err;
                        });

        Promise.all([boards, currUser, post]).then((vals) => {
            this.setState({ boards: vals[0], currUser: vals[1], post: vals[2] });
        });
    }

    handleCreate() {
        axios(`${SERVER_URI}board`, {
            method: 'post',
            withCredentials: true,
            data: { user: { _id: this.state.currUser._id, username: this.state.currUser.username }, title: this.state.boardTitle, post: {_id: this.props.match.params.id, photoUrl: this.state.post.photoUrl } }
        })
        .then((res) => {
            if (res.status === 200) {
                const newBoards = [...this.state.boards];
                newBoards.push(res.data);
                this.setState({boards: newBoards});
            }
        })
        .catch((err) => {
            return err;
        });
    }

    handleClick(board, isSelected) {
        const updateBoardBody = isSelected ? { $pull: { posts: { _id: this.props.match.params.id, photoUrl: this.state.post.photoUrl } }} : { $push: { posts: { _id: this.props.match.params.id, photoUrl: this.state.post.photoUrl } }};
        const updatePostBody = isSelected ? { $pull: { inBoards: { _id: board._id, title: board.title } }} : { $push: { inBoards: { _id: board._id, title: board.title }}}

        // update board
        let boardRes = axios(`${SERVER_URI}board/${board._id}`, {
                            method: 'put',
                            withCredentials: true,
                            data: updateBoardBody
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                const newBoards = [...this.state.boards].map(b => {
                                    if (b._id === board._id) {
                                        b.posts = res.data.posts;
                                    }
                                    return b;
                                });

                                return newBoards;
                            }
                        })
                        .catch((err) => {
                            return err;
                        }); 

        // update post
        let postRes = axios(`${SERVER_URI}post/${this.props.match.params.id}`, {
                            method: 'put',
                            withCredentials: true,
                            data: updatePostBody
                        })
                        .then((res) => {
                            if (res.status === 200) {
                                return res.data;
                            }
                        })
                        .catch((err) => {
                            return err;
                }); 

        Promise.all([boardRes, postRes]).then((vals) => {
            this.setState({ boards: vals[0], post: vals[1] });
        });
    }

    render() {
        return (
            <div id="content-container">
                <div className="center">
                    <h1>BOOKMARK.</h1>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div><Link to={`/post/${this.props.match.params.id}`}><button className="post-button">Back</button></Link></div>
                        <div><button onClick={() => this.setState({showCreateNewBoard: !this.state.showCreateNewBoard})} className="post-button">Create New Board</button></div>
                    </div>
                    { this.state.showCreateNewBoard ? (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px'}}>
                            <div><input type="text" onChange={(e) => this.setState({boardTitle: e.target.value})} placeholder="BOARD TITLE" style={{marginRight: '10px'}}></input></div>
                            <div><button onClick={this.handleCreate} className="post-button">Create</button></div>
                        </div>
                    ) : null}
                    <div style={{marginTop: '30px'}}>
                        {this.state.boards.length === 0 ? <div>No boards yet :(</div> : (this.state.boards.map(board => <BoardIcon onClick={this.handleClick} selected={board.posts.filter(post => post._id === this.props.match.params.id).length === 1} board={board} />))}
                    </div>
                </div>
            </div>
        )
    }
}

export default Bookmark;