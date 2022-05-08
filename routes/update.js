var express = require("express");
var router = express.Router();
var bcrypt = require('bcryptjs');

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
router.get('/', checkLogin, (req, res) => 
{
    console.log('Accept: ' + req.get('Accept'))
    console.log(req.session.username)
    pool.query(`SELECT first_name, last_name FROM users WHERE username = '${req.session.username}'`, (err, result) =>
    {
        if (err) { console.log(err); }
        else 
        {
            res.render('update', {
                firstname: result.rows[0].first_name,
                lastname: result.rows[0].last_name,
                username: req.session.username
            })
        }
    });
});

// POST (Update Profile)
router.post('/', checkLogin, (req, res) => 
{
    console.log("Begin")
    console.log(req.session.username)
    let query = "select first_name, last_name, password FROM users WHERE username = '" + req.session.username + "'";
    pool.query(query, (err, result) => 
    {
        if (err) {console.log(err)}
        else if (req.body.firstName) // first name 
        {
            req.session.user_full_name = req.body.firstName + ' ' + result.rows[0].last_name;
            console.log(req.session.user_full_name)
            pool.query(`UPDATE users SET first_name = '${req.body.firstName}' WHERE username = '${req.session.username}'`, (err, result) => 
            {
                if (err) { console.log(err); }
                else { console.log("Done")}
            })
        }
        else if (req.body.lastName) // last name 
        {
            req.session.user_full_name = result.rows[0].first_name + ' ' + req.body.lastName;
            console.log(req.session.user_full_name)
            pool.query(`UPDATE users SET last_name = '${req.body.lastName}' WHERE username = '${req.session.username}'`, (err, result) => 
            {
                if (err) { console.log(err); }
            })
        }
        else if (req.body.password) // password 
        {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if(err) { console.log(err)}
                    pool.query(`UPDATE users SET password = '${hash}' WHERE username = '${req.session.username}'`,(err, result) => {
                        if (err) { console.log(err); }
                    });
                });
            });
        }
        else if (req.body.username) // username 
        {
            pool.query(`UPDATE users SET username = '${req.body.username}' WHERE username = '${req.session.username}'`, (err, result) => {
                if (err) { console.log(err); }
            })
            req.session.username = req.body.username;
            req.session.save()
        }
    });

    console.log("End")
    res.redirect('/update')
});

module.exports = router;