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
    res.render('update')
})

router.post('/register', function(req,res,next){
    let insertQuery = "INSERT INTO users (username, first_name, last_name, password) VALUES ($1, $2, $3, $4)";
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) { console.log(err)}
            pool.query(insertQuery,[req.body.username, req.body.firstname,req.body.lastname, hash],(err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            });
        });
    });
});


module.exports = router;