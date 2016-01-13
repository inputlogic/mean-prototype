var validator = require('validator');
var async = require('async');
var _ = require('lodash');

module.exports = function(data, done) {
  var self = this;

  var table = self.table();

  var fields = Object.keys(this.validation);

  var invalidFields = {};

  async.each(fields, function(field, callback) {
    var rules = self.validation[field];

    processRules(table, field, rules, data[field], function(err, invalid) {

      if (err) {
        return callback(err);
      }

      if (invalid) {
        invalidFields[field] = invalid;
      }

      return callback();
    });

  }, function(err) {

    if (err) {
      err.status = 500;

      return done(err);
    }

    if (Object.keys(invalidFields).length > 0) {
      var validationError = new Error('invalid fields');
      validationError.invalidFields = invalidFields;
      validationError.status = 400;
      return done(validationError);
    }

    return done();
  });
}

function processRules(table, field, rules, value, done) {

  async.map(Object.keys(rules), function(rule, callback) {

    var param = rules[rule];

    validateRule(table, field, rule, param, value, callback);

  }, function(err, invalid) {
    if (err) {
      return done(err);
    }

    invalid = _.filter(invalid, function(val) { // Filter out rules that passed (invalid value of `undefined`)
      return val;
    });

    if (invalid.length > 0) {
      return done(null, invalid);
    }
    return done();
  });
}

function validateRule(table, field, rule, param, value, done) {
  switch(rule) {
    case 'minLength':

      if (validator.isLength(value, param)) {
        return done();
      }
      return done(null, 'Must be at least ' + param + ' characters');

    case 'maxLength':

      if (validator.isLength(value, 0, param)) {
        return done();
      };
      return done(null, 'Must be less than ' + param + ' characters');

    case 'required':
      if (value) {
        return done();
      }
      return done(null, 'Required field');

    case 'unique':

      var query = {};

      query[field] = value;

      return table.where(query).count('id')
        .asCallback(function(err, result) {

          var count = result[0]['count(`id`)']

          if (err) {
            return done(err);
          }
          if (count === 0) {
            return done();
          }
          return done(null, field + ' is already taken');
        });
  }
}