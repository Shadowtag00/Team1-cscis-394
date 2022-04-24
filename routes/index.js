var express = require("express");
var router = express.Router();

//CREATE (Add comment)
app.post('/', (req,res) => {
    
    //added this
    console.log(req.path)    

    pool.query(`INSERT INTO comments (text) VALUES ('${req.body.commentbox}')`, (err, result) => {
        console.log(err, result)

        res.redirect('/')
    })
})

//added this
app.get('/comment_form', (req, res) => {
    res.render('create')
})


//READ (Display comments)
app.get('/', (req, res) =>{

    console.log('Accept: ' + req.get('Accept'))
    pool.query('SELECT VERSION()', (err, version_results) => {
        //added this
        if (err) {
            return console.error('Error executing query', err.stack)
        }       

        console.log(err, version_results.rows)
        pool.query('SELECT * FROM comments ORDER BY comment_id DESC', (err, comments_results) => {
            console.log(err, comments_results)

            res.render('index', {
                                    comments: comments_results.rows
                                })
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })
    })   
})


// UPDATE
app.get('/comments/:comment_id/form', (req, res) => {
    let query = "UPDATE comments SET is_flagged = NOT is_flagged WHERE comment_id = " + req.params.comment_id;
    console.log(req.params.comment_id)

    pool.query(query, (err, result) => {
        console.log(err, result)      
        res.redirect('/')
    })
})

//DELETE
app.get('/comments/:comment_id/delete', (req, res) => {
    const id = req.params.comment_id
    let query = "DELETE FROM comments WHERE comment_id = " + req.params.comment_id;
    console.log(id)

    pool.query(query, (err, result) => {
        console.log(err)
        res.redirect('/')
    })
})

module.exports = router;



