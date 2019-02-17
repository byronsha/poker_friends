exports.up = (knex, Promise) => Promise.all([
  knex.raw('create extension if not exists "uuid-ossp"'),
  knex.schema.createTable('actions', table => {
    table.increments('id').primary();
    table.uuid('entity_id').defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .integer('hand_id')
      .unsigned()
      .references('id')
      .inTable('hands')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users');
    table.integer('seat').unsigned();
    table.integer('position').unsigned();
    table
      .integer('next_user_id')
      .unsigned()
      .references('id')
      .inTable('users');
    table.integer('next_user_stack');
    table.enu('street', ['deal', 'preflop', 'flop', 'turn', 'river']);
    table.enu('action', ['raise', 'allin', 'call', 'check', 'fold']);
    table.integer('amount').unsigned();
    table.integer('remaining_stack').unsigned();
    table.jsonb('pots')
    table.integer('next_turn_min_raise').unsigned();
    table.timestamps(false, true);
  }),
])

exports.down = knex => knex.schema.dropTableIfExists('actions');