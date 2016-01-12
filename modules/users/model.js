var bcrypt = require('bcrypt');

module.exports = {
  tableName: 'users',

  schema: function schema(table) {
    table.increments();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamps();
  },

  findOneById: function findOneById(userId, done) {
    return done(new Error('not implemented')); 
  },

  // where - an object of query parameters
  // fields (optional) - an array of columns to select
  findOne: function findOne(where, fields) {

    if (!fields) {
      fields = ['name', 'email', 'created_at', 'updated_at'];
    }

    return this.table.where(where).select(fields);
  },

  findAll: function findAll(done) {
    return done(new Error('not implemented')); 
  },

  create: function create(data, done) {

    var self = this;

    bcrypt.hash(data.password, 10, function(err, hash) {

      if (err) {
        return done(err, null);
      }

      var datestamp = new Date();
      data.created_at = datestamp;
      data.updated_at = datestamp;
      data.password = hash;

      self.table.insert(data)
        .then(function(result) {
          done(null, result);
        })
        .catch(function(err) {
          done(err, null);
        });
    });
  }
};