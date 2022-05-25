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
        
        pool.query(`SELECT username, text, post_date FROM comments WHERE is_flagged='f'`, (err, pageCount)=>{
            page_count = (pageCount.rowCount)/10
            console.log(page_count)
        })
        //console.log(pageCount)
        pool.query(`SELECT username, text, post_date FROM comments WHERE is_flagged='f' ORDER BY post_date DESC LIMIT 10 OFFSET ${offset}`, (err, comments_results) => {
	        //Already choose selected posts that weren't flagged
		
            console.log(err, comments_results)

	        //Here create sortBy to sort by dates to show most recent posts first
            
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

//var banned_words;
//function will check if the comment includes banned words on not
function is_banned(text) {



    //const banned_words = ["fuck", "shit", "bitch", "ass"];
    /*
    const banned_words = $.get('profanity.txt',{},function(content){
        let lines=content.split('\n');
  
         console.log(`"Profanity.txt" contains ${lines.length} lines`)
        console.log(`First line : ${lines[0]}`)
  
        });
        */
    
    //console.log(fs.readdirSync('routes/profanity.txt'))
    /*
    fs.readFile('routes/profanity.txt', 'utf8', (err, data) => {
            if (err) throw err;
            
            console.log(data.toString().split('\n'));
            banned_words = data.toString().split('\n');
            console.log(banned_words);

            const words = text.split(" ");

        for (let i = 0; i < words.length; i++) {
            if (banned_words.includes(words[i])) {
                //alert("Posts with profanity are not allowed! Your comment has been flagged for review.")
                console.log("true")
                return true;
            }
        }
        console.log("false")
        return false;
            
        })
        */
    var banned_words = fs.readFileSync("profanity.txt", "utf8");
    banned_words = banned_words.split('\n');  
    
    console.log("output is:"+ banned_words); 
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
        if (banned_words.includes(words[i])) {
            //alert("Posts with profanity are not allowed! Your comment has been flagged for review.")
            return true;
        }
    }
    return false;
    
   console.log("Didn't go off")
}

module.exports = router;
