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
    currentStreet,
  } = args;

  if (action === 'raise') {
    return { isEndOfStreet: false, isEndOfHand: false }
  }

  const userIdToActionsHash = calcUserIdToActionsHash(args);

  const notFoldedUserIds = Object.keys(userIdToActionsHash).filter(userId => {
    const actions = userIdToActionsHash[userId];
    return actions.length > 0 && actions[actions.length - 1].action !== 'fold';
  });

  const betAmounts = notFoldedUserIds.map(userId => {
    const actions = userIdToActionsHash[userId];
    return actions[actions.length - 1].amount;
  })

  if (notFoldedUserIds < 2) {
    console.log('HAND OVER - ALL FOLDED BUT 1')
    return { isEndOfStreet: true, isEndOfHand: true }
  }

  const filterByLastAction = action => userId => {
    const actions = userIdToActionsHash[userId];
    return actions[actions.length - 1].action === action;
  }

  const checkers = notFoldedUserIds.filter(filterByLastAction('check'))
  const allChecked = checkers.length === notFoldedUserIds.length;
  if (allChecked) {
    return { isEndOfStreet: true, isEndOfHand: currentStreet === 'river' };
  }

  const raisers = notFoldedUserIds.filter(filterByLastAction('raise'));
  const allInners = notFoldedUserIds.filter(filterByLastAction('allin'));
  const callers = notFoldedUserIds.filter(filterByLastAction('call'));

  if (action === 'call' && (uniq(betAmounts).length === 1)) {
    return { isEndOfStreet: true, isEndOfHand: currentStreet === 'river' };        
  }

  return { isEndOfStreet: false, isEndOfHand: currentStreet === 'river' };
}

module.exports = function calcPostflop(args) {
  const { isEndOfStreet, isEndOfHand } = checkEndOfStreet(args);
  
  return {
    nextTurnMinRaise: calcNextTurnMinRaise(args),
    amountAddedToBet: calcAmountAddedToBet(args),
    isEndOfStreet,
    isEndOfHand,
  }
}