const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const postflopBets = (lastPreflopAction, lastFlopAction) => {
  return seatNumbers.reduce((acc, i) => {
    if (!lastFlopAction) {
      acc[`seat${i}Bet`] = null;
    } else if (lastPreflopAction[`seat_${i}_stack`]) {
      const stackAtFlopStart = lastPreflopAction[`seat_${i}_stack`];
      acc[`seat${i}Bet`] = stackAtFlopStart - (lastFlopAction ? lastFlopAction[`seat_${i}_stack`] : 0);
    }
    return acc;
  }, {});
}

const postflopStatuses = (userIds, currentHand, allActions) => {
  const userIdToActionsHash = userIds.reduce((acc, userId) => {
    acc[userId] = [
      ...allActions.filter(a => a.user_id === userId).map(a => a.action),
    ];
    return acc;
  }, {})

  return seatNumbers.reduce((acc, i) => {
    if (currentHand[`seat_${i}_info`]) {
      const userId = currentHand[`seat_${i}_id`];
      const userActions = userIdToActionsHash[userId]
      const lastUserAction = userActions[userActions.length - 1];

      acc[`seat${i}Status`] = lastUserAction === 'fold' ? 'folded' : 'active';
    }
    return acc;
  }, {});
}

const postflopViewerActions = (user, currentHand, streetActions, isViewerTurn, stacks) => {
  let viewerActions = null;

  const lastAction = streetActions[streetActions.length - 1];
  if (lastAction.street === 'river' && lastAction.end_of_street) {
    return null;
  }

  seatNumbers.forEach(i => {
    if (currentHand[`seat_${i}_id`] === user.id && isViewerTurn) {
      const raises = streetActions.filter(a => a.action === 'raise');

      let minRaiseAmount = currentHand.big_blind_amount;
      if (raises.length === 1) {
        minRaiseAmount = raises[0].amount * 2;
      } else if (raises.length > 1) {
        const difference = raises[raises.length - 1].amount - raises[raises.length - 2].amount
        minRaiseAmount = raises[raises.length - 1].amount + difference;
      }

      let callAmount = 0;

      if (raises.length > 0) {
        callAmount = raises[raises.length - 1].amount;
      }

      viewerActions = {
        canFold: callAmount !== 0,
        canCheck: callAmount === 0,
        callAmount,
        minRaiseAmount,
        maxRaiseAmount: stacks[`seat${i}Stack`],
      };
    }
  })

  return viewerActions;
}

module.exports = {
  postflopBets,
  postflopStatuses,
  postflopViewerActions,
};