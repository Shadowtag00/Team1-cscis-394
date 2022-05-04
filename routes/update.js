var express = require("express");
var router = express.Router();
//var bcrypt = require('bcryptjs');

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
    res.render('update')
})

router.post('/updateName', function(req,res,next)
{
    let insertQuery = "UPDATE users SET first_name = $1, last_name = $2, password = $3";
    
});

router.post('/updateLastName', function(req,res,next)
{
    let insertQuery = "UPDATE users SET first_name = $1, last_name = $2, password = $3";
    
});

router.post('/updatePassword', function(req,res,next)
{
    let insertQuery = "UPDATE users SET first_name = $1, last_name = $2, password = $3";
    
});


module.exports = router;