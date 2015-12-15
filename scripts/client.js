#!/usr/bin/env node
var path = require('path');
var Orchestrator = require('orchestrator');
var argv = require('yargs').argv;
var task = argv._[0] || 'default';
var args = argv._.slice(1);
var opts = {env: Object.assign(process.env, {PATH: process.env.PATH})};
var tasks = new Orchestrator();

// Define our tasks

tasks.add('lint', function(done) {
  var exec = require('child_process').exec;
  var cmd = 'jshint client/**';
  exec(cmd, opts, logger(done));
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
      console.log(stdout);
    }
    done(err);
  };
}
