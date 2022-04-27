var express = require("express");
var router = express.Router();

function adminonly(req,res,next){
    if (!req.session.isadmin) {
       //return res.redirect('/'); 
    }
    next();
}

function checkLogin(req,res,next){ //verifies there's a user signed in
    if(!req.session.user_id){
       //return res.redirect('/'); 
    }
    next();
}

//CREATE (Add comment)
router.post('/', checkLogin,(req,res) => {
    
    //added this
    console.log(req.path)    

    pool.query(`INSERT INTO comments (text) VALUES ('${req.body.commentbox}')`, (err, result) => {
        console.log(err, result)

        res.redirect('/home') // previously /admin
    })
})

// create new comment page
// router.get('/comment_form', checkLogin,(req, res) => {
//     res.render('create')
// })

//SEARCH
/*
router.post('/', checkLogin,(req,res) => {
    
    //added this
    console.log(req.path)    

    pool.query(`INSERT INTO comments (text) VALUES ('${req.body.commentbox}')`, (err, result) => {
        console.log(err, result)

         // previously /admin
    })
    res.redirect('/home')
})
*/

//READ (Display comments)
router.get('/', adminonly, (req, res) =>{

    console.log('Accept: ' + req.get('Accept'))
    pool.query('SELECT VERSION()', (err, version_results) => {
        //added this
        if (err) {
            return console.error('Error executing query', err.stack)
        }       

        console.log(err, version_results.rows)
        pool.query("SELECT username, text FROM comments WHERE is_flagged='f'", (err, comments_results) => {
            console.log(err, comments_results)
            
            res.render('home', {
                                    comments: comments_results.rows
                                })
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })
    })   
})

module.exports = router;



