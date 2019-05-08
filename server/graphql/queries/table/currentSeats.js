const database = require('../../../database')

const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

module.exports = async (source, args, { user }) => {
  const [currentHand] = await database('hands')
    .where('table_id', source.id)
    .orderBy('created_at', 'DESC')
    .limit(1);

  const playerBuyins = await database('table_buyins')
    .where('table_id', source.id)
    .where('cash_out', null)

  if (!currentHand) {
    const seatedPlayers = playerBuyins.map(p => ({
      seat: p.seat,
      stackAmount: p.buy_in,
      userId: p.user_id,
      isViewer: p.user_id === user.id,
    }));
    return seatedPlayers;
  }

  if (currentHand.is_completed) {
    return seatNumbers.map(i => {
      const userId = currentHand[`seat_${i}_id`];
      const buyin = playerBuyins.find(b => b.user_id === userId);
      if (userId && buyin) {
        return {
          userId,
          seat: i,
          stackAmount: currentHand[`seat_${i}_info`].end_stack,
          isTurn: false,
          isButton: currentHand.button_id === userId,
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
        isButton: currentHand.button_id === userId,
      }
    }
  })

  return seatedPlayers.filter(Boolean);
}