const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const { urlencoded } = require('express');
var bcrypt = require('bcryptjs');
const port = process.env.PORT || 3002
var path = require('path');
var cookieParser = require('cookie-parser');
var app = express();
app.locals.moment = require('moment');
process.env.TZ = "America/Chicago";
//basic authentication
/*
const basicAuth = require('express-basic-auth');
app.use(basicAuth({
    users: {'admin' : 'Team1Password'},
    challenge: true
}));
*/
const session = require('express-session');


//Database
const Pool = require('pg').Pool



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

console.log("Connected to database!");
console.log(connectionParams);
const pool = new Pool(connectionParams);

global.pool = pool;

//ROUTING
var loginRouter = require('./routes/login.js');
var adminRouter = require('./routes/admin.js');
var homeRouter = require('./routes/home.js');
var searchRouter = require('./routes/search.js'); 
var profileRouter = require('./routes/profile.js');
var updateRouter = require('./routes/update.js');

//set view engine for express app
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "jade");

//for parsing application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//for user sessions
app.use(cookieParser());
app.use(session({secret: 'Team1ProjectSecret'}));
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});



//added this
/*
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
*/

//added this
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Credentials", "true");
   res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
   res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
 next();
});

//Web page routing
app.use('/', loginRouter);
app.use('/admin', adminRouter);
app.use('/home', homeRouter);
app.use('/search', searchRouter);
app.use('/profile', profileRouter);
app.use('/update', updateRouter);

app.listen(port, () => {
    console.log(`Comments app listening on port ${port}`)
})

module.exports = app;


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