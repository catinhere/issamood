const router = require('express').Router();
let Post = require('../models/Post');
let User = require('../models/User');

router.route('/:id').get((req, res) => {
    var id = req.params.id;
    Post.findOne({ _id: id })
        .then(post => res.json(post))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post((req, res) => {
    if (!req.user) {
        return res.status(401).json({message: 'Not logged in.'});
    }
    const user = req.user.id;
    const title = req.body.title;
    const photoUrl = req.body.photoUrl;
    const tags = req.body.tags;
    const mood = req.body.mood;
    const newPost = new Post({ user, title, photoUrl, tags, mood });
    newPost.save()
        .then(async (post) => {
            try {
                // add to user's posts
                await User.findOneAndUpdate({_id: req.user.id}, {$push: {posts: post}});
                return res.status(200).json(post);
            } catch (e) {
                res.status(400).json('error: ' + err)
            }
        })
        .catch((err) => {
            res.status(400).json('Error: ' + err)
        });
});

router.route('/:id').put(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({message: 'Not logged in.'});
    }

    try {
        let updatedPost = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        return res.status(200).json(updatedPost);
    } catch (err) {
        return res.status(400).json('Error: ' + err);
    }
})

module.exports = router;