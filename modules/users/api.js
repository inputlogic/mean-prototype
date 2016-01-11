var express = require('express');
// var Users = require('./model');
var router = express.Router();

module.exports = router;

router.post('/create', function(req, res) {
  app.models.users.create(req.body).then(function(rows) {
    return res.json({user_id: rows[0]});
  });
});
