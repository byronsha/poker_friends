const { uniq } = require('lodash')

function _calcUserIdToActionsHash({ amount, action, user, userIds, preflopActions }) {
  return userIds.reduce((acc, userId) => {
    acc[userId] = preflopActions.filter(a => a.user_id === userId)
    if (userId === user.id) {
      acc[userId].push({
        amount,
        action,
      })
    }
    return acc;
  }, {});
}

function _calcLastViewerAction({ user, userIds, preflopActions }) {
  const userIdToActionsHashBefore = userIds.reduce((acc, userId) => {
    acc[userId] = preflopActions.filter(a => a.user_id === userId)
    return acc;
  }, {})

  const viewerActions = userIdToActionsHashBefore[user.id]
  return viewerActions && viewerActions[viewerActions.length - 1];
}

function calcNextTurnMinRaise({ action, amount, lastCallOrRaise, lastAction }) {
  if (action === 'raise') {
    const amountRaised = amount - lastCallOrRaise.amount;
    return amount + amountRaised;
  } else {
    return lastAction.next_turn_min_raise;
  }
}

function calcAmountAddedToBet({
  amount,
  action,
  user,
  userIds,
  hand,
  preflopActions,
}) {
  const lastViewerAction = _calcLastViewerAction({ user, userIds, preflopActions });

  if (['raise', 'call'].includes(action)) {
    if (lastViewerAction && ['raise', 'call'].includes(lastViewerAction.action)) {
      return amount - lastViewerAction.amount;
    } else if (hand.big_blind_id === user.id) {
      return amount - hand.big_blind_amount;
    } else if (hand.small_blind_id === user.id) {
      return amount - hand.big_blind_amount / 2;
    }
  }
}

function checkEndOfStreet(args) {
  const {
    amount,
    action,
    user,
    userIds,
    preflopActions,
  } = args;

  if (action === 'raise') return false;

  const userIdToActionsHash = _calcUserIdToActionsHash(args);

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
  }

  const filterByLastAction = action => userId => {
    const actions = userIdToActionsHash[userId];
    return actions[actions.length - 1].action === action;
  }

  const checkers = notFoldedUserIds.filter(filterByLastAction('check'))
  const allChecked = checkers.length === notFoldedUserIds.length;
  if (allChecked) return true;

  const raisers = notFoldedUserIds.filter(filterByLastAction('raise'));
  const allInners = notFoldedUserIds.filter(filterByLastAction('allin'));
  const callers = notFoldedUserIds.filter(filterByLastAction('call'));

  if (
    action === 'check' &&
    checkers.length === 1 &&
    checkers.length + callers.length === notFoldedUserIds.length
  ) {
    return true;
  }

  if (action === 'call' && (uniq(betAmounts).length === 1)) {
    return true;
  }

  // if (
  //   (raisers.length === 1 && raisers.length + allInners.length + callers.length === notFoldedUserIds.length) ||
  //   (allInners.length > 0 && allInners.length + callers.length === notFoldedUserIds)
  // ) {
  //   return true;
  // }

  return false;
}

module.exports = {
  calcNextTurnMinRaise,
  calcAmountAddedToBet,
  checkEndOfStreet,
}