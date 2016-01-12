var fs = require('fs');

/**
 * Add global (available in both environments) here.
 */
var common = {
  env: process.env.NODE_ENV || 'development',

  /**
   * Middleware defined in /libs/middleware to be loaded on every request.
   */
  middleware: ['abort', 'isLoggedIn', 'morgan', 'passport'],

  /**
   * Modules defined in /modules to be loaded on every request.
   */
  modules: [
    {name: 'users', route: '/users'}
  ],

  session: {
    secret: 'abcdef'
  }
};


// -----------------------------------------------------------------------------
// Handles combining common and env configs
var e = require('./' + common.env);
for(var k in e) {
  common[k] = e[k];
}

// If we're not running in production, override any configs from local.js
if(common.env != 'production'){
	try{
		fs.statSync('./config/local.js');
		var local = require('./local.js');
		for(var k in local)
			common[k] = local[k];
	}catch(err){}
}

module.exports = common;
