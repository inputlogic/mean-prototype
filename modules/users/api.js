var express = require('express');
var router = express.Router();
var userMiddleware = require('./middleware');

module.exports = router;

router.use(userMiddleware.foo);

router.get('/', function(req, res) {
  res.json({message: 'It worked!'});
});
