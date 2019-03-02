exports.up = (knex, Promise) => Promise.all([
  knex.schema.alterTable('hands', table => {
    table.integer('main_pot').unsigned();
    table.jsonb('side_pots');
    table.dropColumn('pots');
  }),
  knex.schema.alterTable('actions', table => {
    table.integer('main_pot').unsigned();
    table.jsonb('side_pots');
    table.dropColumn('pots');
  }),
])

exports.down = (knex, Promise) => Promise.all([
  knex.schema.alterTable('hands', table => {
    table.jsonb('pots');
    table.dropColumn('main_pot');
    table.dropColumn('side_pots');
  }),
  knex.schema.alterTable('actions', table => {
    table.jsonb('pots');
    table.dropColumn('main_pot');
    table.dropColumn('side_pots');
  }),
]);
