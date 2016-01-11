var fs = require('fs');

/**
 * Add global (available in both environments) here.
 */
var common = {
  env: process.env.NODE_ENV || 'development',

  /**
   * Middleware defined in /libs/middleware to be loaded on every request.
   */
  middleware: ['isLoggedIn', 'morgan'],

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

if(common.env == 'development'){
	try{
		fs.statSync('./config/local.js');
		var local = require('./local.js');
		for(var k in local)
			common[k] = local[k];
	}catch(err){}
}

module.exports = common;
