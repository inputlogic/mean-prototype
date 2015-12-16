var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser')
var session = require('express-session');
var nunjucks = require('nunjucks');

var app = express();

// Place database connection values in this file
app.config = require('./config.js');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(session({secret: app.config.sessionSecret, resave: true, saveUninitialized: true}));

// Nunjucks rendering for HTML templates
nunjucks.configure(__dirname + app.config.views, {
  autoescape: true,
  express: app
});

var knex = require('knex')({
  client: 'mysql2',
  connection: app.config.connection
});

require('./models.js')(knex); // Models loader... TODO: maybe flesh out and move into own npm package

// TODO: discuss middleware loader

app.use(require('./modules/auth.js')(knex)); // Module to handle logins

app.use(require('./modules/users.js')(knex)); // Example module (aka controller)

app.get('/*', function (req, res) { // Example endpoint for serving client views
  res.render('index.html', {/* Merge tag values here */});
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Postachio app listening at http://%s:%s', host, port);
});