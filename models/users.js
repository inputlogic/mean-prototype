// Example "users" model

module.exports = function(table) {
  table.increments();
  table.string('name').notNullable();
  table.string('email').notNullable();
  table.timestamps();
};