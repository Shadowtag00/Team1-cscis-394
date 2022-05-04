var express = require("express");
var router = express.Router();

function useronly(req,res,next){
    if (!req.session.user_id)
    {return res.redirect('/');}
    next();
    }

function checkLogin(req,res,next){ //verifies there's a user signed in
    if(!req.session.user_id){
       return res.redirect('/'); 
    }
    next();
}

//READ (Display comments)
router.get('/', function(req, res, next) {
    
    console.log('Accept: ' + req.get('Accept'))
    pool.query('SELECT VERSION()', (err, version_results) => {
        //added this
        if (err) {
            return console.error('Error executing query', err.stack)
        }       

        console.log(err, version_results.rows)
        
        //  and username='${req.session.username}'
        pool.query(`SELECT username, text FROM comments WHERE is_flagged='f' and username='${req.session.username}'`, (err, comments_results) => {
            console.log(err, comments_results)
            
            res.render('profile', {
                                    comments: comments_results.rows,
                                    message: req.session.username
                                })
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })
    }) 
     
})

// UPDATE
    router.get('/:comment_id/form', useronly, (req, res) => {
        let query = "UPDATE comments SET is_flagged = NOT is_flagged WHERE comment_id = " + req.params.comment_id;
        console.log(req.params.comment_id)
    
        pool.query(query, (err, result) => {
            console.log(err, result)      
            res.redirect('/profile')
        //res.redirect('/')
        })
    })

//DELETE
router.get('/:comment_id/delete', useronly, (req, res) => {
    const id = req.params.comment_id
    let query = "DELETE FROM comments WHERE comment_id = " + req.params.comment_id;
    console.log(id)

    pool.query(query, (err, result) => {
        console.log(err)
        res.redirect('/profile')
    })
})

module.exports = router;



