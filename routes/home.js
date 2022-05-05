var express = require("express");
var router = express.Router();

function adminonly(req,res,next){
    if (!req.session.isadmin) {
       return res.redirect('/'); 
    }
    next();
}

function checkLogin(req,res,next){ //verifies there's a user signed in
    if(!req.session.user_id){
       return res.redirect('/'); 
    }
    next();
}

//CREATE (Add comment)
router.post('/', checkLogin,(req,res) => {
    
    //added this
    console.log(req.path)    

    pool.query(`INSERT INTO comments (text, username, post_date) VALUES ('${req.body.comment_box}','${req.session.username}',to_timestamp(${Date.now()} / 1000.0))`, (err, result) => {
        console.log(err, result)
        res.redirect('/home') 
    })
})

//added
// router.get('/update', function(req, res, next) {
// 	res.redirect('/')
// })

//added - delete profile
router.get('/delete', checkLogin, (req, res) => {
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
           
        pool.query("SELECT username, text, post_date FROM comments WHERE is_flagged='f' ORDER BY post_date DESC", (err, comments_results) => {
	//Already choose selected posts that weren't flagged
		
            console.log(err, comments_results)
	//Here create sortBy to sort by dates to show most recent posts first
            
	//Renders posts here
            res.render('home', {
                                    comments: comments_results.rows,
                                    message: req.session.username
                                })
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })
    })   
})

module.exports = router;



