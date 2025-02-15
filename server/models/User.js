const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const likedPostSchema = new Schema({
    _id: { type: Schema.ObjectId, ref: 'Post', required: true },
    photoUrl: {type: String, required: true }
});

const shortUserSchema = new Schema({
    _id: { type: Schema.ObjectId, ref: 'User', required: true },
    profilePic: { type: String, required: true },
    username: { type: String, required: true }
});

const boardSchema = new Schema({
    _id: { type: Schema.ObjectId, ref: 'Board', required: true },
    title: { type: String, required: true }
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        lowercase: true
    },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ },
    profilePic: { type: String, default: "https://res.cloudinary.com/dzabih0aw/image/upload/v1572555290/issamood/default-pic_nsdp5h.jpg" },
    likes: { type: [likedPostSchema] },
    boards: { type: [boardSchema] },
    posts: { type: [Schema.ObjectId], ref: 'Post' },
    following: { type: [shortUserSchema] },
    followers: { type: [shortUserSchema] },
    followedBoards: { type: [boardSchema] }
}, {
    timestamps: true
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model('User', userSchema);

module.exports = User;