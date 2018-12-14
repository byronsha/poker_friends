exports.up = (knex, Promise) =>
  knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.uuid('entity_id');
    table.string('username').unique();
    table.string('email').unique();
    table.string('password_hash');
    table.timestamps(false, true);
  })

exports.down = (knex, Promise) => knex.schema.dropIfExistsTable('users')
