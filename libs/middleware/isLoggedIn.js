module.exports = function isLoggedIn(req, res, next) {
  console.log('running [isLoggedIn] middleware at libs/middleware/isLoggedIn.js');
  return next();
}