const database = require('../../../../database')

module.exports = async (_, { tableEntityId, seat }, { user, pubsub, pokerTables }) => {
  const table = await database('tables')
    .where('entity_id', tableEntityId);

  pokerTables.sitPlayer(user.id, table.id, seat);

  console.log(pokerTables.tables[table.id])

  return true
}