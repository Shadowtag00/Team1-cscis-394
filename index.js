const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const { urlencoded } = require('express');
const port = process.env.PORT || 3002

//set view engine for express app
app.set("view engine", "jade")

//for parsing application/json
app.use(bodyParser.json());

//for parsing application/xwww-
app.use(bodyParser.urlencoded({extended: true}));
//form-urlencoded

//Database
const Pool = require('pg').Pool


//const connectionParams = process.env.DATABASE_URL || {
var connectionParams = null;
if (process.env.DATABASE_URL != null){
    connectionParams = {
        connectionString: process.env.DATABASE_URL,
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
/* const pool = new Pool({
    user: 'api_user',
    host: process.env.DATABASE_URL || 'localhost',
    database: 'api',
    password: 'password',
    port: 5432
}) */

//Display comments
app.get('/', (req, res) =>{

    console.log('Accept: ' + req.get('Accept'))

    //pool.query('SELECT VERSION()', (err, version_results) => {
        //console.log(err, version_results.rows)
    pool.query('SELECT VERSION()', (err, version_results) => {
        console.log(err, version_results.rows)

        //pool.query('SELECT * FROM team_members', (err, team_members_results) => {
            //console.log(err, team_members_results)
        pool.query('SELECT * FROM comments', (err, comments_results) => {
            console.log(err, comments_results)

            //res.render('index', {
                                 //   teamNumber: 1,
                                 //   databaseVersion: version_results.rows[0].version,
                                 //   teamMembers: team_members_results.rows
                                //})

            res.render('index', {
                                    //teamNumber: 1,
                                    //databaseVersion: version_results.rows[0].version,
                                    comments: comments_results.rows
                                    })
            console.log('Content-Type: ' + res.get('Content-Type'))
                            
        })

        //res.send(`<h1>Db Version: ${result.rows[0].version} </h1>`)

       
    })

    
})

//Delete comment
app.get('/:delete_id/delete', (req, res) =>{
    pool.query(`DELETE FROM comments WHERE comment_id = '${req.params.delete_id}'`, (err,result) => {
        console.log(err,result)

        res.redirect('/')
    })
})

//Add comment
app.post('/', (req,res) => {
    pool.query(`INSERT INTO comments (text) VALUES ('${req.body.commentbox}')`, (err, result) => {
        console.log(err, result)

        res.redirect('/')
    })
})

app.listen(port, () => {
    console.log(`Comments app listening on port ${port}`)
})
