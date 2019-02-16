exports.up = (knex, Promise) => Promise.all([
  knex.raw('create extension if not exists "uuid-ossp"'),
  knex.schema.createTable('tables', table => {
    table.increments('id').primary();
    table.uuid('entity_id').defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name');
    table
      .integer('group_id')
      .unsigned()
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE');
    table
      .integer('creator_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.integer('small_blind_amount').unsigned()
    table.integer('big_blind_amount').unsigned()
    table.integer('max_players').unsigned()
    table.timestamps(false, true);
  })  
])

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('tables')
