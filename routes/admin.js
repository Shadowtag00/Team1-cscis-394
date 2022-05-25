var express = require("express");
var router = express.Router();

function adminonly(req,res,next){
    /* istanbul ignore if */
    if (!req.session.is_admin)
    {return res.redirect('/');}
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
//router.post('/comment_form', checkLogin,(req,res) => {
router.post('/', adminonly,(req,res) => {
    
    //added this
    console.log(req.path)    
    if (is_banned(req.body.comment_box) ){
        pool.query(`INSERT INTO comments (text, username, is_flagged, post_date) VALUES ('${req.body.comment_box}','${req.session.username}', 'true', CURRENT_TIMESTAMP)`, (err, result) => {
            console.log(err, result);
            req.session.profanity = {prof: "true"};
            req.session.save();
            res.redirect('/admin');
    })
    }
    else{
        pool.query(`INSERT INTO comments (text, username, post_date) VALUES ('${req.body.comment_box}','${req.session.username}',CURRENT_TIMESTAMP)`, (err, result) => {
            console.log(err, result);
            req.session.profanity = {prof: "false"};
            req.session.save();
            res.redirect('/admin');
        })
    }
    /*
    pool.query(`INSERT INTO comments (text, username, post_date) VALUES ('${req.body.commentbox}', '${req.session.username}', CURRENT_TIMESTAMP)`, (err, result) => {
        console.log(err, result)

        res.redirect('/admin')
    })
    */
})


//READ (Display comments)
router.get('/', adminonly, (req, res) =>{

    console.log('Accept: ' + req.get('Accept'))
    pool.query('SELECT VERSION()', (err, version_results) => {
        //added this
        if (err) {
            return console.error('Error executing query', err.stack)
        }       

        console.log(err, version_results.rows)

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
        pool.query(`SELECT username, text, post_date FROM comments WHERE is_flagged='f'`, (err, pageCount)=>{
            page_count = (pageCount.rowCount)/10
            console.log(page_count)
        })

        if (!req.session.profanity){
            req.session.profanity = {prof: "false"};
        }
        
        pool.query(`SELECT * FROM comments ORDER BY comment_id DESC LIMIT 10 OFFSET ${offset}`, (err, comments_results) => {
            console.log(err, comments_results)

            res.render('admin', {
                                    comments: comments_results.rows,
                                    page_count: page_count,
                                    profanity: JSON.stringify(req.session.profanity)
                                })
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })
    })   
})


// UPDATE
//router.get('/admin/:comment_id/form', adminonly, (req, res) => {
router.get('/:comment_id/form', adminonly, (req, res) => {
    let query = "UPDATE comments SET is_flagged = NOT is_flagged WHERE comment_id = " + req.params.comment_id;
    console.log(req.params.comment_id)

    pool.query(query, (err, result) => {
        console.log(err, result)      
        res.redirect('/admin')
	//res.redirect('/')
    })
})

//DELETE
router.get('/:comment_id/delete', adminonly, (req, res) => {
    const id = req.params.comment_id
    let query = "DELETE FROM comments WHERE comment_id = " + req.params.comment_id;
    console.log(id)

    pool.query(query, (err, result) => {
        console.log(err)
        res.redirect('/admin')
    })
})

//RENDER EDIT COMMENTS
router.get('/:comment_id/edit', adminonly, (req, res) => {
    console.log(req.params.comment_id)
    pool.query("SELECT * FROM comments WHERE comment_id = " + req.params.comment_id, (err, edit_results) => {
        console.log(err, edit_results)
        res.render('edit', {user_record: edit_results.rows[0]});
    })
})


//EDIT COMMENT
router.post('/submit_edit', adminonly, (req,res) =>{
    let query = "UPDATE comments SET text = '" + req.body.comment_box + "' WHERE comment_id = " + req.body.comment_id;
    console.log(query)
    pool.query(query,(err,result) => {
        console.log(err, result)
        res.redirect('/admin')
    })
})

//function will check if the comment includes banned words on not
function is_banned(text) {


    const banned_words = ["fuck", "shit", "bitch", "ass"];
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
        if (banned_words.includes(words[i])) {
            //alert("Posts with profanity are not allowed! Your comment has been flagged for review.")
            return true;
        }
    }
    return false;
}
module.exports = router;
