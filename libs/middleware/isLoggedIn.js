var log = require('../helpers/winston');

module.exports = function isLoggedIn(req, res, next) {
	log.log('info', 'running [isLoggedIn] middleware at libs/middleware/isLoggedIn.js');
  return next();
}
