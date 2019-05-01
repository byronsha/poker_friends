exports.up = knex =>
  knex.schema.alterTable('table_buyins', table => {
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.dropColumn('player_id');
  })

exports.down = knex =>
  knex.schema.alterTable('table_buyins', table => {
    table
      .integer('player_id')
      .unsigned()
      .references('id')
      .inTable('players')
      .onDelete('CASCADE');
    table.dropColumn('user_id');
  })