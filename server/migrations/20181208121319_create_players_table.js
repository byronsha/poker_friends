exports.up = knex =>
  knex.schema.createTable('players', table => {
    table.increments();
    table
      .integer('group_id')
      .unsigned()
      .references('id')
      .inTable('groups')
      .onDelete('CASCADE');
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.float('bankroll');
    table.timestamps(false, true);
  })

exports.down = knex => knex.schema.dropTableIfExists('players')