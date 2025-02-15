const router = require('express').Router();
let User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('../index.js').bcrypt

router.route('/:id').get((req, res) => {
    var id = req.params.id;
    User.findOne({ _id: id })
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    if (username === '') return res.status(400).json({ message: 'You must enter a username.'});
    if (email === '') return res.status(400).json({ message: 'You must enter an email.'});
    if (password === '') return res.status(400).json({ message: 'You must enter a password.'});

    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            let userWithEmail = await User.findOne({ email });
            let userWithUsername = await User.findOne({ username });
            
            if (userWithEmail) return res.status(400).json({ message: 'An account already exists with that email.'});
            if (userWithUsername) return res.status(400).json({ message: 'An account already exists with that username.'});

            const newUser = new User({ username, password: hash, email });

            newUser.save()
                .then((user) => {
                    const token = jwt.sign(true, 'your_jwt_secret');
                    return res.json({user, token})
                })
                .catch(err => {
                    res.status(400).json({ message: err });
                });
        });
    });
});

router.route('/:id').put(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({message: 'Not logged in.'});
    }

    try {
        let updatedUser = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
        return res.status(200).json(updatedUser);
    } catch (err) {
        return res.status(400).json('Error: ' + err);
    }
});

module.exports = router;