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
    app.models.users.findOne({email: username}, ['email', 'password'])
      .then(function(rows) {
        var user = rows[0];

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
  knex('users').where({id: id}).select('id', 'name', 'email', 'created_at', 'updated_at')
    .then(function(users) {
      done(null, users[0]);
    })
    .catch(function(err) {
      done(err, null);
    });
});