const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: { type: Schema.ObjectId, ref: 'User', required: true },
    username: {type: String, required: true },
    profilePic: { type: String, required: true  }
});

const commentSchema = new Schema({
    user: { type: userSchema, required: true },
    comment: { type: String, required: true },
    post: { type: Schema.ObjectId, ref: 'Post', required: true }
}, {
    timestamps: true
});

const Comment = new mongoose.model('Comment', commentSchema);

module.exports = Comment;