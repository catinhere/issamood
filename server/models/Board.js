const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: Schema.ObjectId, required: true },
    username: {type: String, required: true }
});

const postSchema = new Schema({
    _id: { type: Schema.ObjectId, required: true, ref: 'Post' },
    photoUrl: { type: String, required: true }
});

const boardSchema = new Schema({
    user: { type: userSchema, required: true },
    followers: { type: [Schema.ObjectId], ref: 'User' },
    title: { type: String, required: true },
    posts: { type: [postSchema], required: true }
}, {
    timestamps: true
});

const Board = new mongoose.model('Board', boardSchema);

module.exports = Board;