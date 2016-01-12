var express = require('express');
var passport = require('passport');
var router = express.Router();

module.exports = router;

router.post('/create', function(req, res) {
  app.models.users.create(req.body, function(err, rows) {
    return res.json({user_id: rows[0]});
  });
});

router.post('/login', 
  passport.authenticate('local'),
  function(req, res) {
    return res.send('success');
  }
);

router.get('/me', function(req, res) {
  if (!req.user) {
    return res.sendStatus(401);
  }
  return res.json(req.user);
});