var express = require("express");
const url = require("url");
const fs = require('fs');
var router = express.Router();


function adminonly(req,res,next){
    /* istanbul ignore if */
    if (!req.session.is_admin) {
       return res.redirect('/'); 
    }
    next();
}

function checkLogin(req,res,next){ //verifies there's a user signed in
    /* istanbul ignore if */
    if(!req.session.user_id){
       return res.redirect('/'); 
    }
    next();
}

//CREATE (Add comment)
router.post('/', checkLogin,(req,res) => {
    
    //added this
    console.log(req.path)    

    if (is_banned(req.body.comment_box) ){
        pool.query(`INSERT INTO comments (text, username, is_flagged, post_date) VALUES ('${req.body.comment_box}','${req.session.username}', 'true', CURRENT_TIMESTAMP)`, (err, result) => {
            console.log(err, result);
            req.session.profanity = {prof: "true"};
            req.session.save();
            res.redirect('/');
    })
    }
    else{
        pool.query(`INSERT INTO comments (text, username, post_date) VALUES ('${req.body.comment_box}','${req.session.username}',CURRENT_TIMESTAMP)`, (err, result) => {
            console.log(err, result);
            req.session.profanity = {prof: "false"};
            req.session.save();
            res.redirect('/');
        })
    }
    
    
})

//READ (Display comments)
router.get('/', checkLogin, (req, res) =>{


    console.log('Accept: ' + req.get('Accept'))
    pool.query('SELECT VERSION()', (err, version_results) => {
        //added this
        if (err) {
            return console.error('Error executing query', err.stack)
        }       

        console.log(err, version_results.rows)

        //pagination
        const urlParams = new URLSearchParams(req.url)
        console.log(urlParams)
        if (urlParams.has('/?page')==false){
            var pagenumber = 1
        }
        else{
            var pagenumber = urlParams.get('/?page')
        }
        //console.log(pagenumber)
        var offset = (pagenumber - 1) * 10
        var page_count
        //console.log(offset)
        
        pool.query(`SELECT comment_id, username, text, post_date FROM comments`, (err, pageCount)=>{
            page_count = (pageCount.rowCount)/10
            console.log(page_count)
        })
        //console.log(pageCount)
        pool.query(`SELECT comment_id, username, text, post_date FROM comments ORDER BY post_date DESC LIMIT 10 OFFSET ${offset}`, (err, comments_results) => {
	        //Already choose selected posts that weren't flagged
		
            console.log(err, comments_results)

	        //Here create sortBy to sort by dates to show most recent posts first

            //censor
            
            for (let i = 0; i < comments_results.rowCount; i++){
                if(is_banned(comments_results.rows[i].text)){
                    comments_results.rows[i].text = replace_banned(comments_results.rows[i].text);
                }
            }
            
	        //Renders posts here
            if (!req.session.profanity){
                req.session.profanity = {prof: "false"};
            }
            res.render('home', {
                                    comments: comments_results.rows,
                                    message: req.session.username,
                                    page_count: page_count,
                                    profanity: JSON.stringify(req.session.profanity)
                                })
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })
    })   
})




//REPLIES FUNCTIONALITY

//CREATE (Add comment)
router.post('/post_reply', checkLogin,(req,res) => {

    //added this
    console.log(req.path)    

    if (is_banned(req.body.reply_comment_box) ){
        pool.query(`INSERT INTO reply (text, username, is_flagged, post_date, comment_id) VALUES ('${req.body.reply_comment_box}','${req.session.username}', 'true', CURRENT_TIMESTAMP, ${req.body.comment_id})`, (err, result) => {
        console.log(err, result)
        res.redirect(`/home/${req.body.comment_id}/reply`) 
    })
    }
    else{
        pool.query(`INSERT INTO reply (text, username,post_date,comment_id) VALUES ('${req.body.reply_comment_box}','${req.session.username}', CURRENT_TIMESTAMP, ${req.body.comment_id})`, (err, result) => {
            console.log(err, result)
            res.redirect(`/home/${req.body.comment_id}/reply`) 
        })
    }
    
})


//DISPLAY REPLIES PAGE
router.get('/:comment_id/reply', checkLogin, (req, res) =>{
         //Pagination
         const urlParams = new URLSearchParams(req.url)
         console.log(urlParams)
         if (urlParams.has('/?page')==false){
             var pagenumber = 1
         }
         else{
             var pagenumber = urlParams.get('/?page')
         }
         //console.log(pagenumber)
         var offset = (pagenumber - 1) * 10
         var page_count
         //console.log(offset)
         pool.query(`SELECT username, text, post_date FROM comments WHERE is_flagged='f' AND comment_id = ${req.params.comment_id}`, (err, pageCount)=>{
             page_count = (pageCount.rowCount)/10
             console.log(page_count)
         })

        pool.query(`SELECT username, text, post_date FROM reply WHERE is_flagged='f' AND comment_id = ${req.params.comment_id} LIMIT 10 OFFSET ${offset}`, (err, reply_results) => {
	        //Already choose selected posts that weren't flagged
		
            console.log(err, reply_results)

	        //Here create sortBy to sort by dates to show most recent posts first
            for (let i = 0; i < reply_results.rowCount; i++){
                console.log(reply_results.rows[i].text);
            }
    	    //Renders posts here
            //reply_results.rows
            res.render('reply', {
                                    comments: "test",
                                    id : req.params.comment_id,
                                    reply: reply_results.rows,
                                    page_count: page_count-1,
                                    message: req.session.username
            })               
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })
    })
    console.log("end") 




//function will check if the comment includes banned words on not
function is_banned(text) {
    //const banned_words = ["fuck", "shit", "bitch", "ass"];
    
    var banned_words = fs.readFileSync("profanity.txt", "utf8");
    banned_words = banned_words.split('\n');  
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
        if ((banned_words.includes(words[i].toLowerCase()))) {
            //alert("Posts with profanity are not allowed! Your comment has been flagged for review.");
            return true;
        }
    }
    for (let i = 0; i < banned_words.length; i++) {
        if (text.toLowerCase().includes(banned_words[i])){
            return true;
        }
        var spaced_word;
        for(let j = 0; j<banned_words[i].length; j++) {spaced_word=spaced_word+banned_words[i][j]+' '}

        if (text.toLowerCase().includes((spaced_word.slice(-1)))){
            return true;
        }
    }

    return false;
}

function replace_banned(text) {
    //const banned_words = ["fuck", "shit", "bitch", "ass"];
    
    var banned_words = fs.readFileSync("profanity.txt", "utf8");
    banned_words = banned_words.split('\n');  
    const words = text.split(" ");
    var position;
    var word;
    /*
    for (let i = 0; i < words.length; i++) {
        if ((banned_words.includes(words[i].toLowerCase()))) {
            //alert("Posts with profanity are not allowed! Your comment has been flagged for review.");
            return true;
        }
    }
    */

    for (let i = 0; i < banned_words.length; i++) {
        if (text.toLowerCase().includes(banned_words[i])){
            word = banned_words[i];
            break;
        }
        var spaced_word;
        for(let j = 0; j<banned_words[i].length; j++) {spaced_word=spaced_word+banned_words[i][j]+' '}

        if (text.toLowerCase().includes((spaced_word.slice(0,-1)))){
            word = spaced_word.slice(0,-1);
        }
    }

    position = text.indexOf(word)
    return text.toLowerCase().replace(word, '*'.repeat(word.length));
}

module.exports = router;
