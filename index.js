const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const { urlencoded } = require('express');
const port = process.env.PORT || 3002
//basic authentication
const basicAuth = require('express-basic-auth')
app.use(basicAuth({
    users: {'admin' : 'Team1Password'},
    challenge: true
}))
//set view engine for express app
app.set("view engine", "jade")

//for parsing application/json
app.use(bodyParser.json());

//for parsing application/xwww-
app.use(bodyParser.urlencoded({extended: true}));
//form-urlencoded


//added this
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    console.log('contains _method')
    var method = req.body._method
    delete req.body._method
    console.log(method)
    return method
  }
}))


//added this
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Credentials", "true");
   res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
   res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
 next();
});



//var updates = require('./routes/update');
//var deletes = require('./routes/delete');
//app.use('/update', updates);
//app.use('/delete', deletes);

//Database
const Pool = require('pg').Pool


//const connectionParams = process.env.DATABASE_URL1 || {
var connectionParams = null;
if (process.env.DATABASE_URL1 != null){
    connectionParams = {
        connectionString: process.env.DATABASE_URL1,
        ssl: {rejectUnauthorized: false}
    }
} else {
    connectionParams = {
        user: 'api_user',
        host: 'localhost',
        database: 'api',
        password: 'password',
        port: 5432
}
}
console.log(connectionParams)
const pool = new Pool(connectionParams)

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


app.listen(port, () => {
    console.log(`Comments app listening on port ${port}`)
})







/*
//function will check if the comment includes banned words on not
function is_banned_words_in_comment(text) {

    const banned_words = ["banned", "words", "go", "here"];
    const words = text.split(" ");

    for (let i = 0; i < words.length; i++) {
        if (banned_words.includes(words[i])) {
            return true;
        }
    }
    return false;
}
*/




