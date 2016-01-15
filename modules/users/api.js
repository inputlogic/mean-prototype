var express = require('express');
var passport = require('passport');
var router = express.Router();

module.exports = router;

router.post('/create', function(req, res) {
  app.models.users.create(req.body, function(err, rows) {
    if (err) {
      return res.status(err.status).send(err);
    }
    return res.json({user_id: rows[0]});
  });
});

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    return res.send('success');
  }
);

router.post('/logout', function(req, res){
  if(!req.user) return res.sendStatus(401);

  req.logout();
  res.json(req.user);
});

router.get('/me', function(req, res) {
	return (!req.user) ? res.sendStatus(401) : res.json(req.user);
});

router.put('/me', function(req, res){
	if(!req.user) return res.sendStatus(401);

	app.models.users.update(req.user.id, req.body, function(err, result){
		return (err) ? res.abort(500) : res.json(result); //TODO: should result be user?
	})
});

router.delete('/me', function(req, res) {
	if(!req.user) return res.sendStatus(401);

	app.models.users.delete(req.user.id, function(err, result) {
		if (err) {
      return res.abort(500)
    }
    req.logout();
    res.json(req.user);
	});
});
