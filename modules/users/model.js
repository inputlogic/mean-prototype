var async = require('async');
var bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectID;
var schemakit = require('schemakit');

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

module.exports = {
  findById: findById,
  findByAuth: findByAuth,
  create: create,
  update: update,
  del: del
};

function findById(_id, done) {
  users.findOne(ObjectId(_id), done);
}

function findByAuth(email, password, done) {
  return async.waterfall([_find, _comparePass], done);

  function _find(next) {
    users.findOne({email: email}, next);
  }

  function _comparePass(user, next) {
    bcrypt.compare(password, user.password, function(err, result) {
      if (err) return next(err);
      if (!result) return next(); // Hash doesn't match
      next(null, user);
    });
  }
}

function create(data, done) {
  return async.waterfall([_hashPass, _validate, _insert], done);

  function _hashPass(next) {
    bcrypt.hash(data.password, 10, function(err, hash) {
      if (err) return next(err);
      data.password = hash;
      next();
    });
  }

  function _validate(next) {
    schemakit.validate(schema, data, next);
  }

  function _insert(next) {
    users.insertOne(data, next);
  }
}

function update(_id, data, done) {
  users.updateOne({_id: ObjectId(_id)}, {$set: data}, done);
}

function del(_id, done) {
  users.deleteOne({_id: ObjectId(_id)}, done);
}