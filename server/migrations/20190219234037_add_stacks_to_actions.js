const seats = [1, 2, 3, 4, 5, 6, 7, 8, 9];

exports.up = (knex, Promise) => Promise.all([
  knex.schema.alterTable('actions', table => {
    seats.map(i =>
      table.integer(`seat_${i}_stack`).unsigned()
    )
    table.dropColumn('next_user_stack')
    table.dropColumn('remaining_stack')
  })
])

exports.down = function(knex, Promise) {
  knex.schema.alterTable('actions', table => {
    seats.map(i =>
      table.dropColumn(`seat_${i}_stack`)
    )
    table.integer('next_user_stack').unsigned()
    table.integer('remaining_stack').unsigned()
  })
};
