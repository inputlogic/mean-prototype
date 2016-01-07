var fs = require('fs');
var async = require('async');
var express = require('express');
var config = require('./config');
var app = express();
var nunjucks = require('nunjucks').configure('views', {
  autoescape: true,
  express: app
})
var knex = require('knex')({
  client: 'mysql2',
  connection: config.connection
});

async.waterfall([
  loadMiddleware,
  loadModules,
  startServer
]);

function loadMiddleware(done) {
  async.each(config.middleware, function(m, next) {
    console.log('Loading middleware:', m);
    app.use(require('./libs/middleware/' + m));
    next();
  }, done);
}

function loadModules(done) {
  async.each(config.modules, function(module, next) {
    console.log('Loading module:', module.name);
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
    if (exists) { // If there's a single model.js file
      return loadModelFile(module.name, modelFile, next);
    }
    else { // If there are multiple model files in a folder
      fileExists(modelDirectory, function(exists) {
        if (exists) {
          return loadModelDirectory(modelDirectory, next);
        }
        return next();
      });
    }
  });
}

function loadModelFile(name, modelFile, next) {
  var schema = require(modelFile);

  if (typeof schema !== 'function') {
    return next(new Error('Model not defined'));
  }

  knex.schema.createTableIfNotExists(name, require(modelFile))
    .then(function(result) {
      return next();
    })
    .catch(function(err) {
      console.log(err);
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
      console.log('  => api:', apiRoute);
      app.use(apiRoute, require(apiFile));
    }
    return next();
  });
}

function loadModuleController(module, next) {
  var controllerFile = './modules/' + module.name + '/controller.js';
  fileExists(controllerFile, function(exists) {
    if(exists) {
      console.log('  => controller:', module.route);
      app.use(module.route, require(controllerFile))
    }
    return next();
  });
}

function fileExists(file, done) {
  fs.stat(file, function(err, stat) {
    if(err && err.code == 'ENOENT') return done(false);
    return done(true);
  });
}

function startServer() {
  var server = app.listen(config.port || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s in %s mode',  host, port, config.env);
  });
}
