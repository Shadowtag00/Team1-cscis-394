var express = require("express");

var router = express.Router();

router.get('/', (req, res)=> {
    pool.query('SELECT * FROM comments', (err, comments_results) => {
        console.log(err, comments_results)
        res.render('/delete', {
            comments: comments_results.rows
        })

    })
});

router.get('/:comment_id', (req, res)=> {
    pool.query(`DELETE FROM comments WHERE comment_id = '${req.params.delete_id}'`, (err, results) => {
        console.log(err, results)
        res.redirect('/')
    })
});

module.exports = router;