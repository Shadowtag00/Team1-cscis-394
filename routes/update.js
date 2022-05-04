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

//READ (Display Update)
router.get('/', checkLogin, (req, res) => {

    console.log('Accept: ' + req.get('Accept'))

    console.log(err, version_results.rows)
           
    res.render('update')
    
    console.log('Content-Type: ' + res.get('Content-Type')) 
})


module.exports = router;