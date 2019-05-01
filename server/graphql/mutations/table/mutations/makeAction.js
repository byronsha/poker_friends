const { range, uniq, groupBy } = require('lodash')
const database = require('../../../../database')
const calcDeal = require('./streets/deal');
const calcPreflop = require('./streets/preflop');
const calcPostflop = require('./streets/postflop');
const { NEXT_STREET } = require('../../../queries/table/streets/constants')
const endHand = require('./endHand');

const seatNumbers = range(1, 10);

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
  let isEndOfHand = false;
  let nextTurnMinRaise;
  let amountAddedToBet;

  const args = {
    action,
    amount,
    user,
    userIds,
    hand, 
  }

  if (lastAction.street === 'deal') {
    ({ nextTurnMinRaise, amountAddedToBet } = calcDeal(args));
    ({ isEndOfStreet, isEndOfHand } = calcPreflop({
      ...args,
      actions: [],
      lastAction: null,
      lastCallOrRaise: null,
    }, true));
  } else if (currentStreet === 'preflop') {
    const preflopActions = actions['preflop'] || [];
    const lastPreflopAction = preflopActions.length && preflopActions[preflopActions.length - 1];
    const lastPreflopCallOrRaise = preflopActions.length && preflopActions.slice().reverse().find(row => ['raise', 'call'].includes(row.action));

    ({ nextTurnMinRaise, amountAddedToBet, isEndOfStreet, isEndOfHand } = calcPreflop({
      ...args,
      actions: preflopActions,
      lastAction: lastPreflopAction,
      lastCallOrRaise: lastPreflopCallOrRaise,
    }));
  } else {
    const streetActions = actions[currentStreet] || [];
    const lastStreetAction = streetActions.length && streetActions[streetActions.length - 1];
    const lastStreetCallOrRaise = streetActions.length && streetActions.slice().reverse().find(row => ['raise', 'call'].includes(row.action));

    ({ nextTurnMinRaise, amountAddedToBet, isEndOfStreet, isEndOfHand } = calcPostflop({
      ...args,
      currentStreet,
      actions: streetActions,
      allActions: actionRows.filter(r => r.street !== 'deal'),
      lastAction: lastStreetAction,
      lastCallOrRaise: lastStreetCallOrRaise,
    }));
  }

  // todo: handle allin case

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

  if (isEndOfHand) {
    setTimeout(() => endHand(hand, table, pubsub, user), 2500);
  }
}