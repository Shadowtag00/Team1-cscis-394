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

router.post('/update', function(req,res,next)
{
    console.log("HERE !! ")
    if (req.body.name == 'firstNameUpdate')
    {
        req.session.firstname = req.body.firstname;

        pool.query(`UPDATE users SET first_name = '${req.session.firstname}' WHERE username = '${req.session.username}'`, (err, result) => {
            console.log(err);
        })
    }
});

// router.post('/updateLastName', function(req,res,next)
// {
//     req.session.lastname = req.body.lastname;

//     pool.query(`UPDATE users SET last_name = '${req.session.lastname}' WHERE username = '${req.session.username}'`, (err, result) => {
//         console.log(err);
//     })
// });

// router.post('/updatePassword', function(req,res,next)
// {
//     let insertQuery = "UPDATE users SET first_name = $1, last_name = $2, password = $3";
    
// });


module.exports = router;