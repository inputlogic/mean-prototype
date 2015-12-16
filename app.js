var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var cookieParser = require('cookie-parser')
var session = require('express-session');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use(session({secret: "This is a secret", resave: true, saveUninitialized: true}));

// Place database connection values in this file
app.config = require('./config.js');

var knex = require('knex')({
  client: 'mysql2',
  connection: app.config.connection
});

require('./models.js')(knex); // Models loader... TODO: maybe flesh out and move into own npm package

// TODO: discuss middleware loader

app.use(require('./modules/auth.js')(knex)); // Module to handle logins

app.use(require('./modules/users.js')(knex)); // Example module (aka controller)

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Postachio app listening at http://%s:%s', host, port);
});