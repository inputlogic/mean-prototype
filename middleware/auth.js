var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var express = require('express');
var passport = require('passport');

var auth = express();

auth.use(passport.initialize());
auth.use(passport.session());

module.exports = function(knex) {

  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(username, password, done) {
      knex('users').where({email: username}).select('*')
        .then(function(rows) {
          var user = rows[0];

          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }

          bcrypt.compare(password, user.password, function(err, res) {
            if (!res) {
              return done(null, false, { message: 'Incorrect password.' });
            }

            return done(null, user);
          });
        });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    knex('users').where({id: id}).select('*')
      .then(function(user) {
        done(null, user);
      })
      .catch(function(err) {
        done(err, user);
      });
  });

  auth.post('/login',
    passport.authenticate('local'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.send('success');
    });

  return auth;
};