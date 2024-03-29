var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

//Display login prompt
router.get('/', function(req,res,next){
    if(req.session.user_id && req.session.is_admin) //if session is admin, load admin page
        res.redirect('/admin');
    else if(req.session.user_id && !req.session.is_admin) //if session is a regular user, load home page
        res.redirect('/home');
    else
        res.render('login', {message: "Please Login"});
});

//Check Login Credentials
router.post('/login', 
    body('username')
        .notEmpty()
        .isAlphanumeric()
        .isLength({min : 1, max:30}), 
    body('password')
        .notEmpty()
        .matches(/^[A-Za-z0-9 .,'!&]+$/)
        .isLength({min : 1, max:30}),
    function(req, res, next) {
    //validate inputs
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        //return res.status(400).send({errors : errors.array()});
        res.render('login', {Errors:errors.array()});
        return;
    }

    let query = "select username, password, user_id, is_admin FROM users WHERE username = '" + req.body.username + "'";

    // execute query
    pool.query(query, (err, result) => {
        if (err) {console.log(err)}
        else {
            console.log(result)
            if(result.rows[0])
            {
                // Username was correct. Check if password is correct
                bcrypt.compare(req.body.password, result.rows[0].password, function(err, result1) {
                    if(result1) {
                        // Password is correct. Set session variables for user.
                        var userid = result.rows[0].user_id;
                        req.session.user_id = userid;
                        var user_full_name = result.rows[0].first_name + " "+ result.rows[0].last_name;
                        req.session.user_full_name = user_full_name;
			            var user_name = result.rows[0].username;
			            req.session.username = user_name;

                        if(result.rows[0].is_admin){
                            var isadmin = true;
                            req.session.is_admin = isadmin;
                            res.redirect('/admin');
                        } else{
                            res.redirect('/home');
                        }

                    } else {
                        // password do not match
                        res.render('login', {message: "Incorrect Username or Password"});
                    }
                });
            }
            // username does not match
            else {res.render('login', {message: "Incorrect Username or Password"});}
        }
   });
});

//Enable registration
router.get('/register', function(req,res,next){
    res.render('register');
});

//Save register information to db
router.post('/register', 
    body('firstname')
        .notEmpty()
        .isAlpha()
        .withMessage('First name must only contain characters.')
        .isLength({min : 1})
        .withMessage('First name must not be empty.'), 
    body('lastname')
        .notEmpty()
        .isAlpha()
        .withMessage('Last name must only contain characters.')
        .isLength({min : 1})
        .withMessage('Last name must not be empty.'),
    body('username')
        .notEmpty()
        .isAlphanumeric()
        .withMessage('Username can only contain letters and numbers.')
        .isLength({min:1, max:30})
        .withMessage('Username must be less than 30 characters.'),
    body('password')
        .notEmpty()
        .matches(/^[A-Za-z0-9 .,'!&]+$/)
        .isLength({min:1, max:30})
        .withMessage('Password must be less than 30 characters.'),
    function(req,res,next){

    //validate registration
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        //return res.status(400).send({ errors: errors.array()});
        res.render('register', {Errors:errors.array()});
        return;
    }

    let insertQuery = "INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4)";
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) { console.log(err)}
            pool.query(insertQuery,[req.body.username, req.body.firstname,req.body.lastname, hash],(err, result) => {
                if (err) { //an error would indicate duplicate username
                    console.log(err);
                    res.render('register', {message: "That username is already taken!"});

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
	req.session.username = "";
    req.session.is_admin = false;
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;