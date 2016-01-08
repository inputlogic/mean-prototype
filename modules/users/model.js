module.exports = {
  tableName: 'users',

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
  },

  create: function create(data) {
    var datestamp = new Date();
    data.created_at = datestamp;
    data.updated_at = datestamp;
    return this.table.insert(data);
  }
};