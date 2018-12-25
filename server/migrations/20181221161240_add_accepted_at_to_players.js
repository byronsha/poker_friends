exports.up = knex =>
  knex.schema.alterTable('players', table => {
    table.date('accepted_at');
  })

exports.down = knex =>
  knex.schema.alterTable('players', table => {
    table.dropColumn('accepted_at');
  })
