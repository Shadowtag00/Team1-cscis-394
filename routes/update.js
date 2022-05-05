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

// POST (Update Profile)
router.post('/', checkLogin, (req, res) => 
{
    if (req.body.firstName)
    {
        let temp = req.session.user_full_name.split(' ');
        console.log(temp)
        let temp_lastName = temp[1];
        console.log(temp_lastName)
        req.session.user_full_name = req.body.firstName + ' ' + temp_lastName;
        console.log(req.session.user_full_name)
        pool.query(`UPDATE users SET first_name = '${req.body.firstName}' WHERE username = '${req.session.username}'`, (err, result) => 
        {
            console.log(err);
        })
    }
    else if (req.body.lastName)
    {
        req.session.lastname = req.body.lastName;
        pool.query(`UPDATE users SET last_name = '${req.body.lastName}' WHERE username = '${req.session.username}'`, (err, result) => 
        {
            console.log(err);
        })
    }
    else if (req.body.password)
    {
        res.redirect('/')
    }
    else if (req.body.username)
    {
        res.redirect('/')
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