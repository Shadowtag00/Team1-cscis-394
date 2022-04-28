var express = require("express");
var router = express.Router();

function checkLogin(req,res,next){ //verifies there's a user signed in
    if(!req.session.user_id){
       return res.redirect('/'); 
    }
    next();
}

//READ (Display comments)
router.get('/profile', checkLogin, (req, res) =>{

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



