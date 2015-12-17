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
tasks.add('build', ['assets', 'build-js', 'build-css']);
tasks.add('watch', ['watch-js']);
tasks.add('test', ['lint', 'karma']);

tasks.add('build-js', ['lint'], function(done) {
  var cmd = 'browserify client/app.js | uglifyjs -c > public/bundle.js';
  exec(cmd, opts, logger(done));
});

tasks.add('build-css', function(done) {
  var cmd = 'lessc -x client/styles/app.less public/bundle.css';
  exec(cmd, opts, logger(done));
});

tasks.add('watch-js', function(done) {
  spawner('watchify', [
    'client/app.js', 
    '-o', 
    'public/bundle.js',
    '-v'
  ], done);
});

tasks.add('watch-css', function(done) {
  var watch = require('watch');
  var cmd = 'lessc -x client/styles/app.less public/bundle.css';
  watch.createMonitor('client/styles', function (monitor) {
    monitor.on("created", function (f, stat) {
      exec(cmd, opts, logger());
    });
    monitor.on("changed", function (f, curr, prev) {
      exec(cmd, opts, logger());
    });
    monitor.on("removed", function (f, stat) {
      exec(cmd, opts, logger());
    });
  })
});

tasks.add('assets', ['clean'], function(done) {
  var cmd = 'cp client/index.html public/index.html';
  // @TODO: Copy an 'assets/' folder for images, fonts, etc.
  exec(cmd, opts, logger(done));
});

tasks.add('karma', ['lint'], function(done) {
  spawner('karma', ['start', 'karma.conf.js'], done);
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

function spawner(bin, args, done) {
  var spawn = require('child_process').spawn;
  var cmd  = spawn(bin, args || []);
  var buffLog = function(data) { console.log(''+data); };

  cmd.stdout.on('data', buffLog);
  cmd.stderr.on('data', buffLog);
  cmd.on('exit', function(code) {
    console.log('exit code: ' + code);
    if (typeof done === 'function') done();
  });
}

function logger(done) {
  return function(err, stdout) {
    if (err) {
      console.error(task, stdout); 
    } else {
      console.log(stdout || '.');
    }
    if (done) { done(err); }
  };
}
