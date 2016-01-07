module.exports = {
  foo: function(req, res, next) {
    console.log('running [foo] middleware at modules/users/middleware.js');
    return next();
  }
}
