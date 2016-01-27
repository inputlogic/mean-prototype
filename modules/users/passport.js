var passport = require('passport');
var LocalStrategy = require('passport-local');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    app.models.users.findByAuth(email, password, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Invalid login.' });
      done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  app.models.users.findById(id, function(err, user) {
    if (err) return done(err);
    done(null, user);
  });
});