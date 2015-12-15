var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Place database connection values in this file
app.config = require('./config.json');

var knex = require('knex')({
  client: 'mysql2',
  connection: app.config.connection
});

require('./models.js')(app, knex);

app.get('/', function(req, res) {
  knex('users').select('*')
    .then(function(result) {
      res.json(result);
    });
});

app.post('/', function(req, res) {
  knex('users').insert({name: req.body.name, email: req.body.email, created_at: new Date(), updated_at: new Date()})
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      res.status(400).send(err);
    });
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Postachio app listening at http://%s:%s', host, port);
});