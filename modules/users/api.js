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
  app.models.users.insert(req.body, function(err, rows) {
    if (err) {
      return res.status(err.status).send(err);
    }
    return res.json({user_id: rows[0]});
  });
}

function login(req, res) {
  return res.send('success');
}

function logout(req, res){
  if (!req.user) return res.sendStatus(401);
  req.logout();
  return res.json(req.user);
}

function getCurrentUser(req, res) {
	return (!req.user) ? res.sendStatus(401) : res.json(req.user);
}

function updateCurrentUser(req, res) {
	if (!req.user) return res.sendStatus(401);
	app.models.users.update(req.user.id, req.body, function(err, result){
		return (err) ? res.abort(500) : res.json(result); //TODO: should result be user?
	})
}

function deleteCurrentUser(req, res) {
	if (!req.user) return res.sendStatus(401);

  app.models.users.removeById(req.user.id, function(err, result) {
    if (err) return res.abort(500);
    req.logout();
    return res.json(req.user);
  });
}
