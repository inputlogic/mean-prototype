var logger = require('./winston');

module.exports = function isLoggedIn(req, res, next) {
	logger.log('info', 'running [isLoggedIn] middleware at libs/middleware/isLoggedIn.js');
  return next();
}
