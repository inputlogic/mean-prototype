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

require('./models.js')(app, knex);

app.get('/users', function(req, res) {
  knex('users').select('id', 'name', 'email', 'created_at', 'updated_at')
    .then(function(result) {
      res.send(result);
    });
});

app.post('/', function(req, res) {

  // Hash password and store in database
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    knex('users').insert({
      name: req.body.name,
      email: req.body.email,
      created_at: new Date(),
      updated_at: new Date(),
      password: hash
    })
      .then(function(result) {
        res.send(result);
      })
      .catch(function(err) {
        res.status(400).send(err); // Todo: better error handling
      });
  });
});

app.use(require('./middleware/auth.js')(knex));

// Authenticated requests down here

app.get('/me', function(req, res) {
  res.send(req.user);
});


// --------------------------

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Postachio app listening at http://%s:%s', host, port);
});