var express = require("express");
var router = express.Router();

function adminonly(req,res,next){
    // if (!req.session.isadmin) {
    //    return res.redirect('/');
    // }
    next();
}

function checkLogin(req,res,next){ //verifies there's a user signed in
    // if(!req.session.user_id){
    //    return res.redirect('/');
    // }
    next();
}

//CREATE (Add comment)
router.post('/', checkLogin,(req,res) => {
    
    //added this
    console.log(req.path)    

    pool.query(`INSERT INTO comments (text) VALUES ('${req.body.commentbox}')`, (err, result) => {
        console.log(err, result)

        res.redirect('/admin')
    })
})

//added this
router.get('/comment_form', checkLogin,(req, res) => {
    res.render('create')
})


//READ (Display comments)
router.get('/', adminonly, (req, res) =>{

    console.log('Accept: ' + req.get('Accept'))
    pool.query('SELECT VERSION()', (err, version_results) => {
        //added this
        if (err) {
            return console.error('Error executing query', err.stack)
        }       

        console.log(err, version_results.rows)
        pool.query('SELECT * FROM comments ORDER BY comment_id DESC', (err, comments_results) => {
            console.log(err, comments_results)

            res.render('admin', {
                                    comments: comments_results.rows
                                })
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })
    })   
})

module.exports = router;



