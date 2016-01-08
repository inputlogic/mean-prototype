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

  create: function create(done) {
    var table = this.table;
    var data = {
      name: 'Gavin',
      email: 'gavin@geekforbrains.com',
      password: 'buttchicken',
      created_at: new Date(),
      updated_at: new Date()
    };
    table.insert(data).then(done(null, 'yay'));
  }
};