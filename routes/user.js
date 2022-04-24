var express = require("express");
var router = express.Router();
var bcrypt = require('bcrypt.js');


//Display login prompt
router.get('/', function(req,res,next){
    res.render('login', {message: "Please Login"});
});



//Check Login Credentials
router.post('/login', function(req, res, next) {
    let query = "select username, password, user_id FROM user WHERE username = '" + req.body.username + "'";

    // execute query
    pool.query(query, (err, result) => {
        if (err) {console.log(err)}
        else {
            if(result[0])
            {
                // Username was correct. Check if password is correct
                bcrypt.compare(req.body.password, result[0].password, function(err, result1) {
                    if(result1) {
                        // Password is correct. Set session variables for user.
                        var userid = result[0].user_id;
                        req.session.user_id = userid;
                        var user_full_name = result[0].first_name + " "+ result[0].last_name;
                        req.session.user_full_name = user_full_name;

                        if(result[0].isadmin){
                            var isadmin = true;
                            req.session.isadmin = isadmin;
                        }

                        res.redirect('/home');
                    } else {
                        // password do not match
                        res.render('user/login', {message: "Incorrect Password"});
                    }
                });
            }
            else {res.render('user/login', {message: "Incorrect Username"});}
        }
   });
});


//Enable registration
router.get('/register', function(req,res,next){
    res.render('register');
});

//Save register information to db
router.post('/register', function(req,res,next){
    let insertQuery = "INSERT INTO users (username, first_name, last_name, password) VALUES (?, ?, ?, ?)";
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) { res.render('error')}
            pool.query(insertquery,[req.body.firstname, req.body.lastname,req.body.username, hash],(err, result) => {
                if (err) {
                    console.log(err);
                    res.render('error');
                } else {
                    res.redirect('/');
                }
            });
        });
    });
});


//enable logging out
router.get('/logout', function(req, res, next) {
    req.session.user_id = 0;
    req.session.user_full_name = "";
    req.session.isadmin = false;
    res.redirect('/');
});

module.exports = router;