const { camelCase } = require('lodash')
const database = require('../../../database')

const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

module.exports = async (source, args, { user }) => {
  const [currentHand] = await database('hands')
    .where('table_id', source.id)
    .where('is_completed', false);

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

  const stacks = seatNumbers.reduce((acc, i) => {
    acc[`seat${i}Stack`] = lastAction[`seat_${i}_stack`];
    return acc;
  }, {});

  let bets = {};
  let statuses = {};

  if (lastAction.street === 'deal') {
    bets = seatNumbers.reduce((acc, i) => {
      if (currentHand[`seat_${i}_info`]) {
        const stackAtHandStart = currentHand[`seat_${i}_info`].start_stack;
        acc[`seat${i}Bet`] = stackAtHandStart - lastAction[`seat_${i}_stack`];
      }
      return acc;
    }, {});

    statuses = seatNumbers.reduce((acc, i) => {
      if (currentHand[`seat_${i}_info`]) {
        acc[`seat${i}Status`] = 'active';
      }
      return acc;
    }, {})
  }

  return {
    stacks,
    bets,
    statuses,
    board: [],
    mainPot: lastAction.main_pot,
    sidePots: [],
  }
}