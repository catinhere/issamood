const router = require('express').Router();
let Board = require('../models/Board');

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

    Board.find({...query, ...json}).skip(skip).limit(limit).sort(sort)
        .then(boards => res.json(boards))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;