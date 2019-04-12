exports.up = knex =>
  knex.schema.alterTable('actions', table => {
    table.boolean('end_of_street').defaultTo(false);
  })

exports.down = knex =>
  knex.schema.alterTable('actions', table => {
    table.dropColumn('end_of_street');
  })
