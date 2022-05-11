var express = require("express");
//const url = require("url");
var router = express.Router();

function adminonly(req,res,next){
    if (!req.session.is_admin) {
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

    if (is_banned(req.body.comment_box) ){
        pool.query(`INSERT INTO reply (text, username, is_flagged) VALUES ('${req.body.comment_box}','${req.session.username}', 'true')`, (err, result) => {
        console.log(err, result)
        res.redirect('/reply') 
    })
    }
    else{
        pool.query(`INSERT INTO reply (text, username) VALUES ('${req.body.comment_box}','${req.session.username}')`, (err, result) => {
            console.log(err, result)
            res.redirect('/reply') 
        })
    }
    
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

        pool.query(`SELECT username, text FROM reply WHERE is_flagged='f'`, (err, comments_result) => {
	//Already choose selected posts that weren't flagged
		
            console.log(err, comments_results)

	//Here create sortBy to sort by dates to show most recent posts first
            
	//Renders posts here
            res.render('reply', {
                                    comments: comments_results.rows,
                                    message: req.session.username
                                })
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })
    })   
})

module.exports = router;
