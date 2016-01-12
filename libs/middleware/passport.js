var passport = require('passport');
var bcrypt = require('bcrypt')
var LocalStrategy = require('passport-local');

module.exports = [passport.initialize(), passport.session()];

// Logic for authenticating user
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    app.models.users.findOne({email: username}, ['id', 'email', 'password'], function(err, users) {
      var user = users[0];

      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      bcrypt.compare(password, user.password, function(err, res) {
        if (!res) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        delete user.password;

        return done(null, user);
      });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Get user info from request session
passport.deserializeUser(function(id, done) {
  app.models.users.findOne({id: id}, function(err, users) {
    if (err) {
      return done(err);
    }
    else {
      return done(null, users[0]);
    }
  });
});