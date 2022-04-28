var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    let query = `SELECT username, text FROM comments WHERE is_flagged='f' AND username= '${req.query.searchcriteria}'`;

    // execute query
    pool.query(query, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.render('search', {allrecs: result.rows});
        }
    });
});
module.exports = router;