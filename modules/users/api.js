var express = require('express');
var router = express.Router();
var userModel = require('./model');
var userMiddleware = require('./middleware');

module.exports = router;

router.use(userMiddleware.foo);

router.get('/create', function(req, res) {
  userModel.create(function(err, user) {
    console.log(err);
    console.log(user);
    res.json({message: 'It worked!'});
  });
});
