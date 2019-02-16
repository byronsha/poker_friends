exports.up = (knex, Promise) => Promise.all([
  knex.raw('create extension if not exists "uuid-ossp"'),
  knex.schema.createTable('messages', table => {
    table.increments('id').primary();
    table.uuid('entity_id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('body');
    table
      .integer('table_id')
      .unsigned()
      .references('id')
      .inTable('tables')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.timestamps(false, true);
  })
])

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('messages');
