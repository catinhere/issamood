const router = require('express').Router();
let Post = require('../models/Post');
let Comment = require('../models/Comment');

router.route('/:id').get((req, res) => {
    var id = req.params.id;
    Comment.findOne({ _id: id })
        .then(comment => res.json(comment))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post((req, res) => {
    if (!req.user) {
        return res.status(401).json({message: 'Not logged in.'});
    }
    const user = { _id: req.user.id, username: req.user.username, profilePic: req.user.profilePic };
    const comment = req.body.comment;
    const post = req.body.post;
    const newComment = new Comment({ user, comment, post });
    newComment.save()
        .then(async (comment) => {
            try {
                // add to post's comments
                await Post.findOneAndUpdate({_id: post}, {$push: {comments: comment}});
                return res.status(200).json(comment);
            } catch (e) {
                res.status(400).json('error: ' + err)
            }
        })
        .catch((err) => {
            res.status(400).json('Error: ' + err)
        });
});

module.exports = router;