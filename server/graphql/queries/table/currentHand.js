const { groupBy, camelCase } = require('lodash')
const database = require('../../../database')
const { dealBets, dealStatuses, dealViewerActions } = require('./streets/deal');
const { preflopBets, preflopStatuses, preflopViewerActions } = require('./streets/preflop');
const { postflopBets, postflopStatuses, postflopViewerActions } = require('./streets/postflop');
const { BOARD_SIZE, PREVIOUS_STREET, NEXT_STREET } = require('./streets/constants');

const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function viewerCards(currentHand, user) {
  const seat = seatNumbers.find(i =>
    currentHand[`seat_${i}_id`] && currentHand[`seat_${i}_id`] === user.id);

  return currentHand[`seat_${seat}_info`].hand || null;
}

function calcStacks(lastAction) {
  return seatNumbers.reduce((acc, i) => {
    acc[`seat${i}Stack`] = lastAction[`seat_${i}_stack`];
    return acc;
  }, {});
}

function calcCompletedStacks(currentHand) {
  return seatNumbers.reduce((acc, i) => {
    const info = currentHand[`seat_${i}_info`]
    if (info) {
      acc[`seat${i}Stack`] = info.end_stack;
    }
    return acc;
  }, {});
}

function calcCompletedBets() {
  return seatNumbers.reduce((acc, i) => {
    acc[`seat${i}Bet`] = null;
    return acc;
  }, {});
}

function completedHand(currentHand, lastAction, user) {
  const board = currentHand.board.slice(0, BOARD_SIZE[lastAction.street]);

  return {
    entityId: currentHand.entity_id,
    stacks: calcCompletedStacks(currentHand),
    bets: calcCompletedBets(),
    statuses: {},
    board,
    mainPotMinusBets: 0,
    mainPot: 0, // TODO: Swap this for currentHand.main_pot after updating 
    sidePots: [],
    viewerCards: viewerCards(currentHand, user),
    isViewerTurn: false,
    viewerActions: null,
  }
}

module.exports = async (source, args, { user }) => {
  const [currentHand] = await database('hands')
    .where('table_id', source.id)
    .orderBy('created_at', 'DESC')
    .limit(1);

  if (!currentHand) {
    // This is the case where there are either no players or only
    // 1 player sitting at the table. We should allow players to
    // view or join the table here.
    return null;
  };

  const rows = await database('actions')
    .where('hand_id', currentHand.id)
    .orderBy('index', 'ASC');

  if (!rows || !rows.length) return null;

  const lastAction = rows[rows.length - 1];

  if (currentHand.is_completed) {
    return completedHand(currentHand, lastAction, user);
  }

  const isViewerTurn = lastAction.next_user_id === user.id;
  const currentStreet = lastAction.end_of_street ? NEXT_STREET[lastAction.street] : lastAction.street;
  
  const board = currentHand.board.slice(0, BOARD_SIZE[currentStreet]);
  const stacks = calcStacks(lastAction);
  const userIds = seatNumbers.map(i => currentHand[`seat_${i}_id`]).filter(Boolean)
  
  let bets;
  let statuses;
  let viewerActions;

  const actions = groupBy(rows, 'street');
  const preflopActions = actions['preflop'] || [];
  const lastPreflopAction = preflopActions.length && preflopActions[preflopActions.length - 1];

  if (lastAction.street === 'deal') {
    bets = dealBets(user, currentHand);
    statuses = dealStatuses(currentHand);
    viewerActions = dealViewerActions(user, currentHand, isViewerTurn, stacks)
  } else if (currentStreet === 'preflop') {
    bets = preflopBets(currentHand, lastPreflopAction);
    statuses = preflopStatuses(userIds, currentHand, preflopActions);
    viewerActions = preflopViewerActions(user, currentHand, preflopActions, isViewerTurn, stacks)
  } else {
    const previousStreet = PREVIOUS_STREET[currentStreet];
    
    const streetActions = actions[currentStreet] || [];
    const previousStreetActions = actions[previousStreet] || [];
    
    const lastStreetAction = streetActions.length && streetActions[streetActions.length - 1];
    const lastPreviousStreetAction = previousStreetActions.length && previousStreetActions[previousStreetActions.length - 1];

    bets = postflopBets(lastPreviousStreetAction, lastStreetAction)
    statuses = postflopStatuses(userIds, currentHand, rows);
    viewerActions = postflopViewerActions(user, currentHand, streetActions, isViewerTurn, stacks)
  }

  const totalBets = Object.values(bets).filter(Boolean).reduce((acc, i) => acc + i, 0);

  return {
    entityId: currentHand.entity_id,
    stacks,
    bets,
    statuses,
    board,
    mainPotMinusBets: lastAction.main_pot - totalBets,
    mainPot: lastAction.main_pot,
    sidePots: [],
    viewerCards: viewerCards(currentHand, user),
    isViewerTurn,
    viewerActions,
  }
}