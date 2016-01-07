module.exports = {

  /**
   * Defines a SQL table schema and used to automatically create table at 
   * startup.
   */
  schema: function schema(table) {
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