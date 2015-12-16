// Check if user is logged in

module.exports = function(req, res, next) {
  if (!req.user) {
    return res.status(401).send('Unauthorized');
  }
  next();
};