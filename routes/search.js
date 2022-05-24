var express = require('express');
var router = express.Router();
function checkLogin(req,res,next){ //verifies there's a user signed in
    /* istanbul ignore if */
    if(!req.session.user_id){
       return res.redirect('/'); 
    }
    next();
}
router.get('/', checkLogin, function(req, res, next) {
    let query = `SELECT username, text FROM comments WHERE is_flagged='f' AND UPPER(username) = UPPER('${req.query.searchcriteria}')`;

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