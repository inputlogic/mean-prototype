'use strict';

var scripts = require('scripts-plus');
var argv = scripts.argv();

// Define our tasks

scripts.add('default', ['build']);
scripts.add('build', ['assets', 'build-js', 'build-css']);
scripts.add('watch', ['watch-js', 'watch-css']);
scripts.add('test', ['lint', 'karma']);

scripts.add('build-js', ['lint'], function(done) {
  var args = 'client/app.js -t uglifyify -o public/bundle.js'.split(' ');
  scripts.spawn('browserify', args, logger(done));
});

scripts.add('build-css', function(done) {
  var args = '-x client/styles/app.less public/bundle.css'.split(' ');
  scripts.spawn('lessc', args, logger(done));
});

scripts.add('watch-js', function(done) {
  var args = 'client/app.js -o public/bundle.js -v'.split(' ');
  scripts.spawn('watchify', args, logger(done));
});

scripts.add('watch-css', function(done) {
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

scripts.add('karma', ['lint'], function(done) {
  scripts.spawn('karma', ['start', 'karma.conf.js'], logger(done));
});

scripts.add('lint', function(done) {
  scripts.spawn('jshint', ['./client/app.js'], logger(done));
});

scripts.add('clean', ['rm'], function(done) {
  scripts.spawn('mkdir', ['./public'], logger(done));
});

scripts.add('assets', ['clean'], function(done) {
  scripts.spawn('cp', ['client/index.html', 'public/index.html'], logger(done));
});

scripts.add('rm', function(done) {
  scripts.spawn('rm', ['-rf', './public'], logger(done));
});

scripts.add('server', function(done) {
  var statics = require('node-static');
  var fs = require('fs');
  fs.open('./public', 'r', function(err) {
    if (err && err.code === 'ENOENT') {
      console.error('./public does not exist! Run "client build" first.');
    } else {
      var file = new statics.Server('./public');
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
scripts.run(argv);

function logger(done) {
  return function(err, stdout) {
    if (err) {
      console.error(err); 
    } else {
      console.log(stdout || '');
    }
    if (done) { done(err); }
  };
}
