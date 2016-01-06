var express = require('express');
var router = express.Router();

router.get('/index', function(req, res) {
  res.render('users/index.html', {foo: "bar"});
});

module.exports = router;
