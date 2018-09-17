// server.js
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
//var passport = require('passport');
var flash    = require('connect-flash');


var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


// configuration ===============================================================
//var mgurl = process.env.MONGODB_URI;
//var mgurl = 'mongodb://localhost:27017/example';


//mongoose.connect(mgurl); // connect to our database


//require('./config/passport.js')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'hellowhoisthis' })); // session secret
//app.use(passport.initialize());
//app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

///middleware for images/js scripts
app.use('/static', express.static(path.join(__dirname, 'assets')))
app.use('/bower', express.static(path.join(__dirname, 'bower_components')))

// routes ======================================================================
require('./models/routes.js')(app); // load our routes and pass in our app 

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);	

