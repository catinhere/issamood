const router = require('express').Router();
let Board = require('../models/Board');
let User = require('../models/User');
let Post = require('../models/Post');

router.route('/:id').get((req, res) => {
    var id = req.params.id;
    Board.findOne({ _id: id })
        .then(board => res.json(board))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({message: 'Not logged in.'});
    }

    let post = await Post.findOne({_id: req.body.post});
    
    const user = { _id: req.user.id, username: req.user.username };
    const title = req.body.title;
    const posts = [{ _id: req.body.post, photoUrl: post.photoUrl }];
    const newBoard = new Board({ user, title, posts, followers: [] });
    newBoard.save()
        .then(async (board) => {
            try {
                // add to user's boards
                await User.findOneAndUpdate({_id: req.user.id}, {$push: {boards: board}});
                return res.status(200).json(board);
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
        let updatedBoard = await Board.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        return res.status(200).json(updatedBoard);
    } catch (err) {
        return res.status(400).json('Error: ' + err);
    }
})

module.exports = router;