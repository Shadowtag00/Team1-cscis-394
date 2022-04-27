router.get('/', function(req, res, next) {
    let query = "SELECT username, text FROM comments WHERE is_flagged='f' AND username=";

    //console.log("Query: " + query );
    // execute query
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.render('search', {allrecs: result});
        }
    });
});
module.exports = router;