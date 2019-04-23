function calcUserIdToActionsHash({ amount, action, user, userIds, actions }) {
  return userIds.reduce((acc, userId) => {
    acc[userId] = actions.filter(a => a.user_id === userId)
    if (userId === user.id) {
      acc[userId].push({
        amount,
        action,
      })
    }
    return acc;
  }, {});
}

function calcLastViewerAction({ user, actions }) {
  const viewerActions = actions.filter(a => a.user_id === user.id)
  return viewerActions && viewerActions[viewerActions.length - 1];
}

function calcNextTurnMinRaise({ action, amount, lastCallOrRaise, lastAction }) {
  if (action === 'raise') {
    const amountRaised = amount - (lastCallOrRaise ? lastCallOrRaise.amount : 0);
    return amount + amountRaised;
  } else {
    return lastAction.next_turn_min_raise;
  }
}

module.exports = {
  calcUserIdToActionsHash,
  calcLastViewerAction,
  calcNextTurnMinRaise,
};