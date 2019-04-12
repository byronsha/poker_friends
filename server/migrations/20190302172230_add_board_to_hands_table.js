exports.up = knex =>
  knex.schema.alterTable('hands', table => {
    table.specificType('board', 'jsonb');
  })

exports.down = knex =>
  knex.schema.alterTable('hands', table => {
    table.dropColumn('board');
  })
