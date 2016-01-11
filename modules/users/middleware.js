module.exports = {
  foo: function(req, res, next) {
    app.log.info('running [foo] middleware at modules/users/middleware.js');
    return next();
  }
}
