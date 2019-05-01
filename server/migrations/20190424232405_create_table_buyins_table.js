exports.up = knex =>
  knex.schema.createTable('table_buyins', table => {
    table.increments();
    table
      .integer('table_id')
      .unsigned()
      .references('id')
      .inTable('tables')
      .onDelete('CASCADE');
    table
      .integer('player_id')
      .unsigned()
      .references('id')
      .inTable('players')
      .onDelete('CASCADE');
    table
      .integer('seat')
      .unsigned();    
    table.float('buy_in');
    table.float('cash_out');
    table.timestamps(false, true);
  })

exports.down = knex => knex.schema.dropTableIfExists('table_buyins')