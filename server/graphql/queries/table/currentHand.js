const { groupBy, camelCase } = require('lodash')
const database = require('../../../database')
const {
  dealStatuses,
  dealViewerActions
} = require('./streets/deal');
const {
  preflopBets,
  preflopStatuses,
  preflopViewerActions,
} = require('./streets/preflop');
const {
  flopBets,
  flopStatuses,
  flopViewerActions,
} = require('./streets/flop');

const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const NEXT_STREET = {
  'deal': 'preflop',
  'preflop': 'flop',
  'flop': 'turn',
  'turn': 'river',
};

module.exports = async (source, args, { user }) => {
  const [currentHand] = await database('hands')
    .where('table_id', source.id)
    .where('is_completed', false);

  if (!currentHand) return null;

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

  const userIds = seatNumbers.map(i => currentHand[`seat_${i}_id`]).filter(Boolean)

  const stacks = seatNumbers.reduce((acc, i) => {
    acc[`seat${i}Stack`] = lastAction[`seat_${i}_stack`];
    return acc;
  }, {});

  let bets = {};
  let statuses = {};
  let board = [];
  let viewerActions = null;

  const isViewerTurn = lastAction.next_user_id === user.id;
  const currentStreet = lastAction.end_of_street ? NEXT_STREET[lastAction.street] : lastAction.street;
  
  const actionRows = await database('actions')
    .where('hand_id', currentHand.id)
    .orderBy('index', 'ASC');
  const actions = groupBy(actionRows, 'street');
  const preflopActions = actions['preflop'] || [];
  const flopActions = actions['flop'] || [];

  const lastPreflopAction = preflopActions.length && preflopActions[preflopActions.length - 1];
  const lastFlopAction = flopActions.length && flopActions[flopActions.length - 1];

  if (lastAction.street === 'deal') {
    bets = preflopBets(currentHand, lastPreflopAction);
    statuses = dealStatuses(currentHand);
    viewerActions = dealViewerActions(user, currentHand, isViewerTurn, stacks)
  } else if (currentStreet === 'preflop') {
    bets = preflopBets(currentHand, lastPreflopAction);
    statuses = preflopStatuses(userIds, currentHand, preflopActions);
    viewerActions = preflopViewerActions(user, currentHand, preflopActions, isViewerTurn, stacks)
  } else if (currentStreet === 'flop') {
    bets = flopBets(currentHand, lastPreflopAction, lastFlopAction)
    statuses = flopStatuses(userIds, currentHand, preflopActions, flopActions);
    viewerActions = flopViewerActions(user, currentHand, flopActions, isViewerTurn, stacks)
    board = currentHand.board.slice(0, 3)
  }

  let viewerCards;
  seatNumbers.forEach(i => {
    if (currentHand[`seat_${i}_id`] && currentHand[`seat_${i}_id`] === user.id) {
      viewerCards = currentHand[`seat_${i}_info`].hand;
    }
  })

  return {
    entityId: currentHand.entity_id,
    stacks,
    bets,
    statuses,
    board,
    mainPot: lastAction.main_pot,
    sidePots: [],
    viewerCards,
    isViewerTurn,
    viewerActions,
  }
}