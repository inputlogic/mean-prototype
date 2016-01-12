var fs = require('fs');
var async = require('async');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require('express-session');
var express = require('express');
var nunjucks = require('nunjucks')
var knex = require('knex');
var config = require('./config');
var winston = require('./libs/helpers/winston');
var fileExists = require('./libs/helpers/fileExists');
var db = knex(config.db);

app = express();
app.config = config;
app.log = winston(config);
app.models = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({secret: app.config.session.secret, resave: true, saveUninitialized: true}));

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

async.waterfall([
  loadMiddleware,
  loadModules,
  startServer
]);

function loadMiddleware(done) {
  async.each(app.config.middleware, function(m, next) {
    app.log.info('Loading middleware:', m);
    app.use(require('./libs/middleware/' + m));
    next();
  }, done);
}

function loadModules(done) {
  async.each(app.config.modules, function(module, next) {
    app.log.info('Loading module:', module.name);
    loadModuleModels(module, function(err) {
      loadModuleApi(module, function() {
        loadModuleController(module, next);
      });
    });
  }, done);
}

function loadModuleModels(module, next) {
  var modelFile = './modules/' + module.name + '/model.js';
  var modelDirectory = './modules/' + module.name + '/models';
  fileExists(modelFile, function(exists) {
    if(exists) { // If there's a single model.js file
      return loadModelFile(module.name, modelFile, next);
    }
    else { // If there are multiple model files in a folder
      fileExists(modelDirectory, function(exists) {
        if(exists) {
          return loadModelDirectory(modelDirectory, next);
        }
        return next();
      });
    }
  });
}

function loadModelFile(name, modelFile, next) {
  var model = require(modelFile);
	app.models[name] = model;
  model.db = db; // Attach Knex instance for all models
  model.table = function() {
    return db(model.tableName);
  };

  if(typeof model.schema !== 'function') {
    return next(new Error('Schema not defined for model: ' + name));
  }

  db.schema.createTableIfNotExists(model.tableName, model.schema)
    .then(function(result) {
      return next();
    })
    .catch(function(err) {
      app.log.error(err);
      return next(err);
    });
}

function loadModelDirectory(modelDirectory, next) {
  var files = fs.readdir(modelDirectory, function() {
    async.each(files, function(filename, callback) {

      var modelName = filename.split('.')[0];

      return loadModelFile(modelName, modelDirectory + '/' + filename, callback);
    }, next);
  });
}

function loadModuleApi(module, next) {
  var apiFile = './modules/' + module.name + '/api.js';
  fileExists(apiFile, function(exists) {
    if(exists) {
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
    if(exists) {
      app.log.info('  => controller:', module.route);
      app.use(module.route, require(controllerFile))
    }
    return next();
  });
}


function startServer() {
  if(process.env.NODE_ENV == 'test') return; // Don't start server if we're running test suite
  var server = app.listen(app.config.port || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    app.log.info('Listening at http://%s:%s in %s mode',  host, port, app.config.env);
  });
}
