#!/usr/bin/env node
var path = require('path');
var exec = require('child_process').exec;
var Orchestrator = require('orchestrator');
var argv = require('yargs').argv;
var task = argv._[0] || 'default';
var args = argv._.slice(1);
var opts = {env: Object.assign(process.env, {PATH: process.env.PATH})};
var tasks = new Orchestrator();

// Define our tasks

tasks.add('default', ['build']);
tasks.add('build', ['clean', 'assets', 'build-js']);
tasks.add('watch', ['watch-js']);

tasks.add('build-js', ['lint', 'clean'], function(done) {
  var cmd = 'browserify client/app.js | uglifyjs -mc > public/bundle.js';
  exec(cmd, opts, logger(done));
});

tasks.add('watch-js', function(done) {
  var fs = require('fs');
  var browserify = require('browserify');
  var watchify = require('watchify');
  var b = browserify({
    entries: ['client/app.js'],
    cache: {},
    packageCache: {},
    plugin: [watchify]
  });
   
  b.on('update', bundle);
  b.on('log', console.log);
  bundle();
   
  function bundle() {
    b.bundle().pipe(fs.createWriteStream('public/bundle.js'));
  }
});

tasks.add('assets', ['clean'], function(done) {
  var cmd = 'cp client/index.html public/index.html';
  // @TODO: Copy an 'assets/' folder for images, fonts, etc.
  exec(cmd, opts, logger(done));
});

tasks.add('lint', function(done) {
  var cmd = 'jshint client/**.js';
  exec(cmd, opts, logger(done));
});

tasks.add('clean', ['rm'], function(done) {
  exec('mkdir ./public', opts, logger(done));
});

tasks.add('rm', function(done) {
  exec('rm -rf ./public', opts, logger(done));
});

tasks.add('server', function(done) {
  var static = require('node-static');
  var fs = require('fs');
  fs.open('./public', 'r', function(err) {
    if (err && err.code === 'ENOENT') {
      console.error('./public does not exist! Run "client build" first.');
    } else {
      var file = new static.Server('./public');
      require('http').createServer(function(request, response) {
        request.addListener('end', function() {
          file.serve(request, response);
        }).resume();
      }).listen(8000);
      console.log('Server started on port 8000');
    }
    done(err);
  });
});

// Run the specified task
tasks.start(task, function(err) {
  if (err) {
    console.error(task, err); 
  } else {
    console.log(task, 'completed!');
  }
});

function logger(done) {
  return function(err, stdout) {
    if (err) {
      console.error(task, stdout); 
    } else {
      console.log(stdout || '.');
    }
    done(err);
  };
}
