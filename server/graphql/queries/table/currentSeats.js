const database = require('../../../database')

const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

module.exports = async (source, args, { user, pokerTables }) => {
  const [currentHand] = await database('hands')
    .where('table_id', source.id)
    .orderBy('created_at', 'DESC')
    .limit(1);

  if (!currentHand) {
    // This is the case where there are either no players or only
    // 1 player sitting at the table. We should allow players to
    // view or join the table here.
    const players = pokerTables.players(source.id);
    const seatedPlayers = players.map(p => ({ ...p, isViewer: p.userId === user.id }));
    return seatedPlayers;
  }

  if (currentHand.is_completed) {
    return seatNumbers.map(i => {
      const userId = currentHand[`seat_${i}_id`];
      if (userId) {
        return {
          userId,
          seat: i,
          stackAmount: currentHand[`seat_${i}_info`].end_stack,
          isTurn: false,
          isButton: currentHand.big_blind_id === userId,
        }
      }
    }).filter(Boolean)
  }

  const [lastAction] = await database('actions')
    .where('hand_id', currentHand.id)
    .orderBy('index', 'DESC')
    .limit(1);

  if (!lastAction) return null;

  const seatedPlayers = seatNumbers.map(i => {
    if (currentHand[`seat_${i}_id`]) {
      const userId = currentHand[`seat_${i}_id`];

      return {
        userId,
        seat: i,
        stackAmount: lastAction[`seat_${i}_stack`],
        isTurn: lastAction.next_user_id === userId,
        isButton: currentHand.big_blind_id === userId, // only handles heads up case
      }
    }
  })

  return seatedPlayers.filter(Boolean);
}