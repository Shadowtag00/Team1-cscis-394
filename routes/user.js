var express = require("express");
var router = express.Router();
//var bcrypt = require('bcrypt.js');


//Display login prompt
router.get('/', function(req,res,next){
    res.render('login', {message: "Please Login"});
});

//Check Login Credentials
/*
router.post('/login', function(req,res,next){
    
});
*/

//Enable registration
router.get('/register', function(req,res,next){
    res.render('register');
});

//Save register information to db
router.post('/register', function(req,res,next){
    let insertQuery = "INSERT INTO users (username, first_name, last_name, password) VALUES (?, ?, ?, ?)";
    pool.query(insertQuery, [req.body.username, req.body.firstname, req.body.lastname, req.body.password], (err,result) => {
        if(err){
            console.log(err);
            res.redirect('/user/register');
        }else{
            res.redirect('/user/login');
        }

    });
});

module.exports = router;