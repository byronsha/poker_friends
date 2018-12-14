exports.up = (knex, Promise) =>
  knex.schema.createTable('groups', table => {
    table.increments('id').primary();
    table.uuid('entity_id');
    table.string('name');
    table
      .integer('creator_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.timestamps(false, true);
  })  

exports.down = (knex, Promise) => knex.schema.dropTableIfExists('groups')