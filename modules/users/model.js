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

  // Helper for findOneBy[...] queries 
  //
  // where - an object of query parameters
  // fields (optional) - an array of columns to select
  _findOneBy: function findOneBy(where, fields, done) {

    var select;

    if (typeof fields === 'function') {
      select = ['id', 'name', 'email', 'created_at', 'updated_at'];

      done = fields;
    }

    this.table().where(where).select(select)
      .asCallback(function(err, rows) {
        if (err) {
          return done(err);
        }
        return done(null, rows[0]);
      });
  },

  findOneById: function findOneById(id, fields, done) {
    return this._findOneBy({id: id}, fields, done);
  },

  findOneByEmail: function findOneByEmail(email, fields, done) {
    return this._findOneBy({email: email}, fields, done);
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

      self.table().insert(data)
        .asCallback(done);
    });
  }
};