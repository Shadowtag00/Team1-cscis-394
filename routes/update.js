var express = require("express");

var router = express.Router();

router.get('/', (req, res)=> {
    pool.query('SELECT * FROM comments', (err, comments_results) => {
        console.log(err, comments_results)
        res.render('update', {comments: comments_results.rows})

    })
});

module.exports = router;