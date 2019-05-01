const { uniq } = require('lodash')
const { calcUserIdToActionsHash, calcLastViewerAction, calcNextTurnMinRaise } = require('./helpers');

function calcAmountAddedToBet({
  amount,
  action,
  user,
  userIds,
  hand,
  actions,
}) {
  const lastViewerAction = calcLastViewerAction({ user, userIds, actions });

  if (['raise', 'call'].includes(action)) {
    if (lastViewerAction && ['raise', 'call'].includes(lastViewerAction.action)) {
      return amount - lastViewerAction.amount;
    } else if (hand.big_blind_id === user.id) {
      return amount - hand.big_blind_amount;
    } else if (hand.small_blind_id === user.id) {
      return amount - hand.big_blind_amount / 2;
    }
  }

  return amount;
}

function checkEndOfStreet(args) {
  const {
    amount,
    action,
    user,
    userIds,
    actions,
  } = args;

  if (action === 'raise') {
    return { isEndOfStreet: false, isEndOfHand: false }
  }

  const userIdToActionsHash = calcUserIdToActionsHash(args);

  const notFoldedUserIds = Object.keys(userIdToActionsHash).filter(userId => {
    const actions = userIdToActionsHash[userId];
    return actions.length === 0 || (actions.length > 0 && actions[actions.length - 1].action !== 'fold');
  });

  const betAmounts = notFoldedUserIds.map(userId => {
    const actions = userIdToActionsHash[userId];
    return actions.length > 0 ? actions[actions.length - 1].amount : 0;
  })

  if (notFoldedUserIds.length < 2) {
    console.log('HAND OVER - ALL FOLDED BUT 1')
    return { isEndOfStreet: true, isEndOfHand: true }
  }

  const filterByLastAction = action => userId => {
    const actions = userIdToActionsHash[userId];
    return actions.length > 0 && actions[actions.length - 1].action === action;
  }

  const checkers = notFoldedUserIds.filter(filterByLastAction('check'))
  const allChecked = checkers.length === notFoldedUserIds.length;
  if (allChecked) {
    return { isEndOfStreet: true, isEndOfHand: false };
  }

  const raisers = notFoldedUserIds.filter(filterByLastAction('raise'));
  const allInners = notFoldedUserIds.filter(filterByLastAction('allin'));
  const callers = notFoldedUserIds.filter(filterByLastAction('call'));

  if (
    action === 'check' &&
    checkers.length === 1 &&
    checkers.length + callers.length === notFoldedUserIds.length
  ) {
    return { isEndOfStreet: true, isEndOfHand: false };    
  }

  if (action === 'call' && (uniq(betAmounts).length === 1)) {
    return { isEndOfStreet: true, isEndOfHand: false };        
  }

  return { isEndOfStreet: false, isEndOfHand: false };
}

module.exports = function calcPreflop(args, isDeal = false) {
  const { isEndOfStreet, isEndOfHand } = checkEndOfStreet(args);

  let nextTurnMinRaise;
  let amountAddedToBet;

  if (!isDeal) {
    nextTurnMinRaise = calcNextTurnMinRaise(args);
    amountAddedToBet = calcAmountAddedToBet(args);
  }

  return {
    nextTurnMinRaise,
    amountAddedToBet,
    isEndOfStreet,
    isEndOfHand,
  }
}