// Put model definitions in the `models` folder.

var fs = require('fs');

module.exports = function(knex) {

  var files = fs.readdirSync(__dirname + '/models');

  files.forEach(function(filename) {
    var model = filename.split('.')[0];
    knex.schema.createTableIfNotExists(model, require('./models/' + model))
      .then(function(result) {
        console.log('Created table `' + model + '`');
      })
      .catch(function(err) {
        console.log(err);
        process.exit(1);
      });
  });
};