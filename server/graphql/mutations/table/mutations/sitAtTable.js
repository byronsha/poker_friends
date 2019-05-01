const database = require('../../../../database')
const initHand = require('./initHand');

module.exports = async (_, { tableEntityId, seat, stackAmount }, { user, pubsub }) => {
  const [table] = await database('tables')
    .where('entity_id', tableEntityId);

  await database('table_buyins')
    .insert({
      user_id: user.id,
      table_id: table.id,
      seat,
      buy_in: stackAmount,
    })

  const players = await database('table_buyins')
    .where('table_id', table.id)
    .where('cash_out', null)

  const seatedPlayers = players.map(p => ({
    seat: p.seat,
    stackAmount: p.buy_in,
    userId: p.user_id,
    isViewer: p.user_id === user.id,
  }));

  pubsub.publish('tableUpdated', {
    tableUpdated: {
      currentSeats: seatedPlayers,
      id: table.id,
      tableEntityId,
    },
  });

  if (seatedPlayers.length > 1) {
    setTimeout(() => initHand(table, seatedPlayers, pubsub, user), 5000);
  }

  return true
}