exports.up = (knex, Promise) => Promise.all([
  knex.raw('create extension if not exists "uuid-ossp"'),
  knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.uuid('entity_id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('username').unique();
    table.string('email').unique();
    table.string('password_hash');
    table.timestamps(false, true);
  })
])

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('users')
