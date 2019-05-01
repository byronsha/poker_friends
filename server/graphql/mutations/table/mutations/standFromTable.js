const database = require('../../../../database')

module.exports = async (_, { tableEntityId }, { user, pubsub }) => {
  const [table] = await database('tables')
    .where('entity_id', tableEntityId);
  
  const buyins = await database('table_buyins')
    .where('table_id', table.id)
    .where('cash_out', null);

  const playerBuyin = buyins.find(b => b.user_id === user.id)

  const [lastAction] = await database('hands')
    .select(`actions.*`)
    .join('actions', 'hands.id', 'actions.hand_id')
    .orderBy('hands.created_at', 'DESC')
    .orderBy('actions.index', 'DESC')
    .limit(1);

  await database('table_buyins')
    .update({
      cash_out: lastAction[`seat_${playerBuyin.seat}_stack`],
    })
    .where('id', playerBuyin.id)

  const seatedPlayers = buyins.filter(b => b.user_id !== user.id).map(p => ({
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

  return true
}