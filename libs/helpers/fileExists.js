var fs = require('fs');

module.exports = function fileExists(file, done) {
  fs.stat(file, function(err, stat) {
    if(err && err.code == 'ENOENT') return done(false);
    return done(true);
  });
}
