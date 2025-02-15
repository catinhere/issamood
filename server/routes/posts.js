const router = require('express').Router();
let Post = require('../models/Post');

router.route('/').get((req, res) => {
    let limit = parseInt(req.query.limit, 10) || 30;
    let skip = parseInt(req.query.skip, 10) || 0;
    let sort = req.query.sort || {};
    let query = req.query || {};
    let json = query.json ? JSON.parse(req.query.json) : {};
    
    // remove from query to avoid false querying
    delete query.json;
    delete query.skip;
    delete query.limit;
    delete query.sort;

    Post.find({...query, ...json}).skip(skip).limit(limit).sort(sort)
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;