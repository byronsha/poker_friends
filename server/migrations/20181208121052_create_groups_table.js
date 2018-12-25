exports.up = (knex, Promise) => Promise.all([
  knex.raw('create extension if not exists "uuid-ossp"'),
  knex.schema.createTable('groups', table => {
    table.increments('id').primary();
    table.uuid('entity_id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name');
    table
      .integer('creator_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamps(false, true);
  })  
])

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('groups')