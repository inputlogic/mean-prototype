module.exports = function isLoggedIn(req, res, next) {
  console.log('at isLoggedIn middleware');
  return next();
}