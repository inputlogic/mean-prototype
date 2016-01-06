/**
 * Add global (available in both environments) here.
 */
var common = {
  env: process.env.APP_ENV || 'development',

  /**
   * Middleware defined in /libs/middleware to be loaded on every request.
   */
  middleware: ['isLoggedIn'],

  /**
   * Modules defined in /modules to be loaded on every request.
   */
  modules: [
    {name: 'users', route: '/users'}
  ]
};


// -----------------------------------------------------------------------------
// Handles combining common and env configs
var e = require('./' + common.env);
for(var k in e) {
  common[k] = e[k];
}
module.exports = common;