const { range, uniq, groupBy } = require('lodash')
const database = require('../../../../database')
const { calculateCurrentHand } = require('../../../queries/table/currentHand')
const {
  calcNextTurnMinRaise,
  calcAmountAddedToBet,
  checkEndOfStreet,
} = require('./streets/preflop');

const seatNumbers = range(1, 10);

const NEXT_STREET = {
  'deal': 'preflop',
  'preflop': 'flop',
  'flop': 'turn',
  'turn': 'river',
};

module.exports = async (_, { handEntityId, action, amount }, { user, pubsub }) => {
  const [hand] = await database('hands')
    .where('entity_id', handEntityId);

  const [table] = await database('tables')
    .where('id', hand.table_id);

  const actionRows = await database('actions')
    .where('hand_id', hand.id)
    .orderBy('index', 'ASC');
  const lastAction = actionRows[actionRows.length - 1];
  const lastCallOrRaise = actionRows.slice().reverse().find(row => ['raise', 'call'].includes(row.action));

  const actions = groupBy(actionRows, 'street');
  const preflopActions = actions['preflop'] || [];
  const flopActions = actions['flop'] || [];

  const lastPreflopAction = preflopActions.length && preflopActions[preflopActions.length - 1];
  const lastFlopAction = flopActions.length && flopActions[flopActions.length - 1];

  const userIds = seatNumbers.map(i => hand[`seat_${i}_id`]).filter(Boolean)
  const userIdToSeatHash = seatNumbers.reduce((acc, i) => {
    if (hand[`seat_${i}_id`]) {
      acc[hand[`seat_${i}_id`]] = i
    }
    return acc
  }, {})

  const previous = userIds.indexOf(lastAction.next_user_id)
  const next = previous === userIds.length - 1 ? 0 : previous + 1;
  
  const nextUserId = userIds[next];
  const currentStreet = lastAction.end_of_street ? NEXT_STREET[lastAction.street] : lastAction.street;

  let isEndOfStreet = false;
  let nextTurnMinRaise = table.big_blind_amount * 2;

  let amountAddedToBet;

  if (lastAction.street === 'deal') {
    isEndOfStreet = true;

    if (action === 'raise' || action === 'call') {
      if (hand.big_blind_id === user.id) {
        amountAddedToBet -= hand.big_blind_amount;
      } else if (hand.small_blind_id === user.id) {
        amountAddedToBet -= hand.big_blind_amount / 2;
      }
    }

    if (action === 'raise') {
      const amountRaised = amount - hand.big_blind_amount;
      nextTurnMinRaise = amount + amountRaised;
    }
  } else if (currentStreet === 'preflop') {
    nextTurnMinRaise = calcNextTurnMinRaise({
      action,
      amount,
      lastCallOrRaise,
      lastAction,
    });
    amountAddedToBet = calcAmountAddedToBet({
      amount,
      action,
      user,
      userIds,
      hand,
      preflopActions,
    });
    isEndOfStreet = checkEndOfStreet({
      amount,
      action,
      user,
      userIds,
      preflopActions,
    });
  } else if (currentStreet === 'flop') {

  }

  // todo: handle allin case
  // todo: calculate next turn min raise

  const stacks = seatNumbers.reduce((acc, i) => {
    if (userIdToSeatHash[user.id] === i) {
      acc[`seat_${i}_stack`] = lastAction[`seat_${i}_stack`] - amountAddedToBet;
    } else {
      acc[`seat_${i}_stack`] = lastAction[`seat_${i}_stack`]
    }
    return acc;
  }, {})

  const mainPot = lastAction.main_pot + amountAddedToBet;

  await database('actions')
    .insert({
      hand_id: hand.id,
      index: lastAction.index + 1,
      user_id: user.id,
      seat: userIdToSeatHash[user.id],
      position: null,
      next_user_id: nextUserId,
      street: currentStreet,
      action,
      amount,
      next_turn_min_raise: nextTurnMinRaise,
      ...stacks,
      main_pot: mainPot,
      side_pots: null,
      end_of_street: isEndOfStreet,
    })

  pubsub.publish('tableUpdated', {
    tableUpdated: {
      id: table.id,
      tableEntityId: table.entity_id,
    },
  });
}