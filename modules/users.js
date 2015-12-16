var express = require('express');
var bcrypt = require('bcrypt');

var users = express();

module.exports = function(knex) {

  users.post('/signup', function(req, res) {

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

  users.get('/me', // Example of path that requires authenticated request
    require('../middleware/isLoggedIn.js'),
    function(req, res) {
      res.send(req.user);
    });

  return users;
};