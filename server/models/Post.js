const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: Schema.ObjectId, required: true },
    username: {type: String, required: true },
    profilePic: { type: String, required: true  }
});

const boardSchema = new Schema({
    _id: { type: Schema.ObjectId, required: true },
    title: {type: String, required: true }
});

const commentSchema = new Schema({
    user: { type: userSchema, required: true },
    comment: { type: String, required: true },
    post: { type: Schema.ObjectId, ref: 'Post', required: true }
}, {
    timestamps: true
});

const postSchema = new Schema({
    user: { type: Schema.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    photoUrl: { type: String, required: true },
    tags: { type: [String], required: true },
    mood: { type: String, required: true },
    likes: { type: Number, required: true, default: 0 },
    likedBy: { type: [Schema.ObjectId], ref: 'User' },
    comments: { type: [commentSchema] },
    inBoards: { type: [boardSchema] }
}, {
    timestamps: true
});

const Post = new mongoose.model('Post', postSchema);

module.exports = Post;