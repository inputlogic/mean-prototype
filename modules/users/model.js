module.exports = {

  /**
   * Creates the table. Called automatically on app startup.
   */
  init: function init(table) {
    table.increments();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('password').notNullable();
    table.timestamps();
  },

  findOne: function findOne(userId, done) {
    return done(new Error('not implemented')); 
  },

  findAll: function findAll(done) {
    return done(new Error('not implemented')); 
  }
};