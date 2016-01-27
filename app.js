var fs = require('fs');
var async = require('async');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var express = require('express');
var nunjucks = require('nunjucks');
var mongodb = require('mongodb');
var passport = require('passport');
var config = require('./config');
var winston = require('./libs/helpers/winston');
var fileExists = require('./libs/helpers/fileExists');

app = express();
app.config = config;
app.log = winston(config);
app.db = null; // Set during initDb
app.models = {}; // Set during loadModules

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  secret: app.config.session.secret, 
  resave: true,
  saveUninitialized: true
}));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

async.series([
  initDb,
  loadMiddleware,
  loadModules,
	load404Handler,
  startServer
]);

function initDb(done) {
  var client = mongodb.MongoClient;
  client.connect(app.config.db.path, app.config.db.options, function(err, db) {
    if(err) throw err;
    app.log.info('Connected to MongoDB:', app.config.db);
    app.db = db;  
    return done();
  });
}

function loadMiddleware(done) {
  async.each(app.config.middleware, function(m, next) {
    app.log.info('Loading middleware:', m);
    app.use(require('./libs/middleware/' + m));
    next();
  }, done);
}

function loadModules(done) {
  async.each(app.config.modules, function(module, nextLoop) {
    app.log.info('Loading module:', module.name);
    async.series([
      function(nextSeries) {loadModuleModels(module, nextSeries)},
      function(nextSeries) {loadModuleApi(module, nextSeries)},
      function(nextSeries) {loadModuleController(module, nextSeries)},
      function(nextSeries) {loadModulePassport(module, nextSeries)}
    ], nextLoop);
  }, done);
}

function loadModuleModels(module, next) {
  var modelFile = './modules/' + module.name + '/model.js';
  var modelDirectory = './modules/' + module.name + '/models';
  fileExists(modelFile, function(exists) {
    if (exists) { // If there's a single model.js file
      app.log.info('  => model');
      return loadModelFile(module.name, modelFile, next);
    } else { // If there are multiple model files in a folder
      fileExists(modelDirectory, function(exists) {
        if (exists) return loadModelDirectory(modelDirectory, next);
        return next();
      });
    }
  });
}

function loadModelFile(name, modelFile, done) {
  var model = require(modelFile);
  if (typeof model.init === 'function') {
    return model.init(done);
  }
  return done();
}

function loadModelDirectory(modelDirectory, next) {
  var files = fs.readdir(modelDirectory, function() {
    async.each(files, function(filename, callback) {
      var modelName = filename.split('.')[0];
      app.log.info('  => model:', modelName);
      return loadModelFile(modelName, modelDirectory + '/' + filename, callback);
    }, next);
  });
}

function loadModuleApi(module, next) {
  var apiFile = './modules/' + module.name + '/api.js';
  fileExists(apiFile, function(exists) {
    if (exists) {
      var apiRoute = '/api' + module.route;
      app.log.info('  => api:', apiRoute);
      app.use(apiRoute, require(apiFile));
    }
    return next();
  });
}

function loadModuleController(module, next) {
  var controllerFile = './modules/' + module.name + '/controller.js';
  fileExists(controllerFile, function(exists) {
    if (exists) {
      app.log.info('  => controller:', module.route);
      app.use(module.route, require(controllerFile))
    }
    return next();
  });
}

function loadModulePassport(module, next) {
  var passportFile = './modules/' + module.name + '/passport.js';
  fileExists(passportFile, function(exists) {
    if (exists) {
      app.log.info('  => passport strategy');
      require(passportFile);
    }
    return next();
  });
}

function load404Handler(next){
	app.use(function handle404(req,res,done){
		res.abort(404, 'not found!');
		done();
	});
	next();
}

function startServer() {
  if (process.env.NODE_ENV == 'test') return; // Don't start server if we're running test suite
  var server = app.listen(app.config.port || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    app.log.info('Listening at http://%s:%s in %s mode',  host, port, app.config.env);
  });
}

function cleanup() {
  if (cleanup.ran) return;
  cleanup.ran = true;
  app.log.info('Cleaning up...');
  app.db.close(); 
  return process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
