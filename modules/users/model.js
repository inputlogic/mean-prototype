var async = require('async');
var bcrypt = require('bcrypt');
var schemakit = require('schemakit');

module.exports = {
  findOneById: findOneById,
  findOneByEmail: findOneByEmail
};

var users = app.db.collection('users');
var schema = {
  name: {
    type: 'string',
    required: true
  },
  email: {
    type: 'string',
    required: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: 'string',
    required: true,
    validate: {
      min: 32 // 32 == Must be hash
    }
  }
};

function findOneById(id, fields, done) {
  return _findOneBy({id: id}, fields, done);
}

function findOneByEmail(email, fields, done) {
  return _findOneBy({email: email}, fields, done);
}

function findAll(done) {
  return knex(tableName).select(['id', 'name', 'email', 'created_at', 'updated_at'])
    .asCallback(done);
}

function create(data, done) {
  return async.waterfall([
    function hashPassword(next) {
      bcrypt.hash(data.password, 10, function(err, hash) {
        if (err) return next(err);
        data.password = hash;
        return next();
      });
    },
    function validate(next) {
      return schemakit.validate(schema, data);
    },
    function createUser(next) {
      return knex(tableName).insert(data).asCallback(next);
    }
  ], done);
}