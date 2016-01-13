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

  validation: {
    name: {
      required: true
    },
    email: {
      required: true,
      unique: true
    },
    password: {
      required: true,
      minLength: 8
    }
  },

  // Helper for findOneBy[...] queries 
  //
  // where - an object of query parameters
  // fields (optional) - an array of columns to select
  _findOneBy: function _findOneBy(where, fields, done) {

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
    this._findOneBy({id: id}, fields, done);
  },

  findOneByEmail: function findOneByEmail(email, fields, done) {
    this._findOneBy({email: email}, fields, done);
  },

  findAll: function findAll(done) {
    this.table().select(['id', 'name', 'email', 'created_at', 'updated_at'])
      .asCallback(done);
  },

  create: function create(data, done) {

    var self = this;

    this.validate(data, function(err) {
      if (err) {
        return done(err);
      }
      return createUser();
    });

    function createUser() {
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
  }

  // _validate: function _validate(data, done) {

  //   var errors = [];

  //   if (!data.email) {
  //     errors.push({email: 'Required field'});
  //   }
  //   else if (!validator.isEmail(data.email)) {
  //     errors.push({email: 'Not a valid email'});
  //   }

  //   if (!data.name) {
  //     errors.push({name: 'Required field'})
  //   }

  //   if (!data.password) {
  //     errors.push({name: 'Required field'})
  //   }
  //   else if (!validator.isLength(data.password, 8)) {
  //     errors.push({name: 'Must be at least 8 characters'});
  //   }

  //   if (errors.length === 0) {
  //     return done();
  //   }
  //   var err = new Error('Invalid fields');

  //   err.invalidFields = errors;

  //   err.status = 400;

  //   return done(err);
  // }
};