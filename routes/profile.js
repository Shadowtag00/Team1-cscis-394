var express = require("express");
var router = express.Router();

function useronly(req,res,next){
    /* istanbul ignore if */
    if (!req.session.username)
    {return res.redirect('/');}
    next();
    }

function checkLogin(req,res,next){ //verifies there's a user signed in
    /* istanbul ignore if */
    if(!req.session.user_id){
       return res.redirect('/'); 
    }
    next();
}

//added - delete profile
router.get('/:username/delete', checkLogin, (req, res) => {
	const u_name = req.session.username

	console.log(u_name)

	pool.query(`DELETE FROM comments WHERE username = '${req.session.username}'`, (err, result) => {
		console.log(err)
	})
    pool.query(`DELETE FROM users WHERE username = '${req.session.username}'`, (err, result) => {
        req.session.user_id = 0;
		req.session.user_full_name = "";
		req.session.username = "";
		req.session.is_admin = false;
		res.redirect('/')
    })
})

//READ (Display comments)
router.get('/', checkLogin, (req, res) =>{
    
    console.log('Accept: ' + req.get('Accept'))
    pool.query('SELECT VERSION()', (err, version_results) => {
        //added this
        if (err) {
            return console.error('Error executing query', err.stack)
        }       

        console.log(err, version_results.rows)
        
        //  and username='${req.session.username}'
        pool.query(`SELECT username, text, comment_id FROM comments WHERE is_flagged='f' and username='${req.session.username}'`, (err, comments_results) => {
            console.log(err, comments_results)
            
            res.render('profile', {
                                    comments: comments_results.rows,
                                    user: req.session.username
                                })
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })
    }) 
})

//DELETE
router.get('/:comment_id/deleteComment', checkLogin, (req, res) => {
    const id = req.params.comment_id
    let query = "DELETE FROM comments WHERE comment_id = " + req.params.comment_id;
    console.log(id)

    pool.query(query, (err, result) => {
        console.log(err)
        res.redirect('/profile')
    })
})

module.exports = router;



