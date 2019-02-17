const { range } = require('lodash');

const seats = [1, 2, 3, 4, 5, 6, 7, 8, 9];

exports.up = (knex, Promise) => Promise.all([
  knex.raw('create extension if not exists "uuid-ossp"'),
  knex.schema.createTable('hands', table => {
    table.increments('id').primary();
    table.uuid('entity_id').defaultTo(knex.raw('uuid_generate_v4()'));
    table
      .integer('table_id')
      .unsigned()
      .references('id')
      .inTable('tables')
      .onDelete('SET NULL');
    table.integer('big_blind_amount').unsigned();
    table
      .integer('button_id')
      .unsigned()
      .references('id')
      .inTable('users')
    table
      .integer('small_blind_id')
      .unsigned()
      .references('id')
      .inTable('users')
    table
      .integer('big_blind_id')
      .unsigned()
      .references('id')
      .inTable('users')
    table.boolean('is_completed');
    table.boolean('went_to_showdown');
    table.jsonb('pots');
    table.jsonb('winners');
    table.boolean('end_of_session');
    seats.map(i =>
      table
        .integer(`seat_${i}_id`)
        .unsigned()
        .references('id')
        .inTable('users'),
    );
    seats.map(i => table.jsonb(`seat_${i}_info`));
    table.timestamps(false, true);
  }),
])

exports.down = knex => knex.schema.dropTableIfExists('hands');