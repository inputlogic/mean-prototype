var express = require('express');
var router = express.Router();

module.exports = router;

router.get('/index', function(req, res) {
  res.render('users/index.html', {foo: "bar"});
});

router.get('/buttchicken', function(req, res){
	res.abort(300, "buttchicken error");
})
