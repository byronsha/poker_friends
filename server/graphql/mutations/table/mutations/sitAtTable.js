const database = require('../../../../database')
const initHand = require('./initHand');

module.exports = async (_, { tableEntityId, seat, stackAmount }, { user, pubsub, pokerTables }) => {
  const [table] = await database('tables')
    .where('entity_id', tableEntityId);

  pokerTables.sitPlayer(user.id, table.id, seat, stackAmount);
  
  const players = pokerTables.players(table.id);
  const seatedPlayers = players.map(p => ({ ...p, isViewer: p.userId === user.id }));

  pubsub.publish('tableUpdated', {
    tableUpdated: {
      currentSeats: seatedPlayers,
      id: table.id,
      tableEntityId,
    },
  });

  if (seatedPlayers.length > 1) {
    setTimeout(() => initHand(table, pokerTables, pubsub, user), 5000);
  }

  return true
}