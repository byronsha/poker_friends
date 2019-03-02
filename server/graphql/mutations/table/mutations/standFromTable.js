const database = require('../../../../database')

module.exports = async (_, { tableEntityId }, { user, pubsub, pokerTables }) => {
  const [table] = await database('tables')
    .where('entity_id', tableEntityId);

  pokerTables.standPlayer(user.id, table.id);

  const players = pokerTables.players(table.id);
  const seatedPlayers = players.map(p => ({ ...p, isViewer: p.userId === user.id }));

  pubsub.publish('tableUpdated', {
    tableUpdated: {
      currentSeats: seatedPlayers,
      id: table.id,
      tableEntityId,
    },
  });

  return true
}