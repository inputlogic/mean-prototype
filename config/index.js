/**
 * Add global (available in both environments) here.
 */
var common = {
  env: process.env.APP_ENV || 'development',
  middleware: ['isLoggedIn'],
  modules: [
    {name: 'users', route: '/users'}
  ]
};

// Handles combining common and env configs
var e = require('./' + common.env);
for(var k in e) {
  common[k] = e[k];
}
module.exports = common;