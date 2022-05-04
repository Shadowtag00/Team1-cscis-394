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
router.get('/update_profile', function(req, res, next) {
	res.redirect('/')
})


//added - delete profile
router.get('/delete', checkLogin, (req, res) => {
	const u_name = req.session.username
	//const u_name = req.params.username
	//let query = `DELETE FROM users WHERE username = '${req.session.username}'`;
	//let query = "Delete From users where username = " + req.params.username;
	let query = "DELETE FROM users WHERE user_id = " + req.session.user_id;
	console.log(u_name)

	pool.query(query, (err, result) => {
		console.log(err)
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

router.get('/profile', function(req, res, next) {

    res.redirect('/')
    
    // console.log('Accept: ' + req.get('Accept'))
    // pool.query('SELECT VERSION()', (err, version_results) => {
    //     //added this
    //     if (err) {
    //         return console.error('Error executing query', err.stack)
    //     }       

    //     console.log(err, version_results.rows)
        
    //     //  and username='${req.session.username}'
    //     pool.query(`SELECT username, text FROM comments WHERE is_flagged='f'`, (err, comments_results) => {
    //         console.log(err, comments_results)
            
    //         res.render('profile', {
    //                                 comments: comments_results.rows,
    //                                 message: req.session.username
    //                             })
    //         console.log('Content-Type: ' + res.get('Content-Type'))
                            
    //     })
    // }) 
     
})

module.exports = router;



