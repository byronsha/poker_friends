const database = require('../../../../database')

module.exports = async (_, { tableEntityId }, { user, pubsub, pokerTables }) => {
  const table = await database('tables')
    .where('entity_id', tableEntityId);

  pokerTables.standplayer(user.id, table.id);

  console.log(pokerTables.tables[table.id])

  return true
}