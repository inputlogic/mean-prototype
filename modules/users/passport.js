var passport = require('passport');
var bcrypt = require('bcrypt')
var LocalStrategy = require('passport-local');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    app.models.users.findOneByEmail(username, ['id', 'email', 'password'], function(err, user) {

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
  app.models.users.findOneById(id, function(err, user) {
    if (err) {
      return done(err);
    }
    else {
      return done(null, user);
    }
  });
});