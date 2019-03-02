const database = require('../../../database')

const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

module.exports = async (source, args, { user, pokerTables }) => {
  const [currentHand] = await database('hands')
    .where('table_id', source.id)
    .where('is_completed', false);

  if (!currentHand) {
    const players = pokerTables.players(table.id);
    const seatedPlayers = players.map(p => ({ ...p, isViewer: p.userId === user.id }));
    return seatedPlayers;
  }

  const { rows } = await database.raw(`
    SELECT *
    FROM actions
    WHERE hand_id = ?
    AND index = (
      SELECT MAX(index)
      FROM actions a
      WHERE a.hand_id = actions.hand_id
    )
  `, [currentHand.id]);

  if (!rows || !rows.length) return null;

  const lastAction = rows[0];

  const seatedPlayers = seatNumbers.map(i => {
    if (currentHand[`seat_${i}_id`]) {
      return {
        userId: currentHand[`seat_${i}_id`],
        seat: i,
        stackAmount: lastAction[`seat_${i}_stack`]
      }
    }
  })

  return seatedPlayers.filter(Boolean);
}