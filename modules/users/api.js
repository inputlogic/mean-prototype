var express = require('express');
var passport = require('passport');
var router = express.Router();

module.exports = router;

router.post('/create', createUser);
router.post('/login', passport.authenticate('local'), login);
router.post('/logout', logout);
router.get('/me', getCurrentUser);
router.put('/me', updateCurrentUser);
router.delete('/me', deleteCurrentUser);

function createUser(req, res) {
  app.models.users.create(req.body, function(err, rows) {
    if (err) return res.status(err.status).send(err);
    res.json({user_id: rows[0]});
  });
}

function login(req, res) {
  res.json('success');
}

function logout(req, res){
  if (!req.user) return res.sendStatus(401);
  req.logout();
  res.json(req.user);
}

function getCurrentUser(req, res) {
  if(!req.user) return res.sendStatus(401);
  res.json(req.user);
}

function updateCurrentUser(req, res) {
	if (!req.user) return res.sendStatus(401);
	app.models.users.update(req.user._id, req.body, function(err, result) {
    if(err) {
      app.log.error(err);
      return res.abort(500);
    }

    res.json(result); 
	});
}

function deleteCurrentUser(req, res) {
	if (!req.user) return res.sendStatus(401);
  app.models.users.del(req.user._id, function(err, result) {
    if (err) return res.abort(500);
    if (result.result.n < 1) return res.abort(404, 'User doesnt exist');
    req.logout();
    res.json(req.user);
  });
}
