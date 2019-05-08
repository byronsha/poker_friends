const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const preflopBets = (currentHand, lastAction) => {
  return seatNumbers.reduce((acc, i) => {
    if (currentHand[`seat_${i}_info`]) {
      const stackAtHandStart = currentHand[`seat_${i}_info`].start_stack;
      acc[`seat${i}Bet`] = stackAtHandStart - lastAction[`seat_${i}_stack`];
    }
    return acc;
  }, {});
}

const preflopStatuses = (userIds, currentHand, preflopActions) => {
  const userIdToActionsHash = userIds.reduce((acc, userId) => {
    acc[userId] = preflopActions.filter(a => a.user_id === userId).map(a => a.action)
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

const preflopViewerActions = (user, currentHand, preflopActions, isViewerTurn, stacks) => {
  let viewerActions = null;

  const notAllInPlayers = seatNumbers.map(i =>
    preflopActions[0] && preflopActions[0][`seat_${i}_stack`]
  ).filter(stack => stack !== null && stack > 0);
  const canRaise = notAllInPlayers.length > 1;

  seatNumbers.forEach(i => {
    if (currentHand[`seat_${i}_id`] === user.id && isViewerTurn) {
      const raises = preflopActions.filter(a => a.action === 'raise');
      const canCheckBigBlind = user.id === currentHand.big_blind_id && raises.length === 0;

      let minRaiseAmount = currentHand.big_blind_amount * 2;
      if (raises.length === 1) {
        const difference = raises[0].amount - currentHand.big_blind_amount;
        minRaiseAmount = raises[0].amount + difference;
      } else if (raises.length > 1) {
        const difference = raises[raises.length - 1].amount - raises[raises.length - 2].amount
        minRaiseAmount = raises[raises.length - 1].amount + difference;
      }

      let callAmount = currentHand.big_blind_amount;

      if (raises.length > 0) {
        callAmount = raises[raises.length - 1].amount;
      }

      let maxRaiseAmount = stacks[`seat${i}Stack`];
      
      if (user.id === currentHand.small_blind_id) {
        maxRaiseAmount += currentHand.big_blind_amount / 2;
      } else if (user.id === currentHand.big_blind_id) {
        maxRaiseAmount += currentHand.big_blind_amount;
      }

      if (callAmount >= maxRaiseAmount) {
        callAmount = maxRaiseAmount;
        minRaiseAmount = null;
        maxRaiseAmount = null;
      }

      if (!canRaise) {
        minRaiseAmount = null;
        maxRaiseAmount = null;
      }

      viewerActions = {
        canFold: !canCheckBigBlind,
        canCheck: canCheckBigBlind || callAmount === 0,
        callAmount: canCheckBigBlind ? 0 : callAmount,
        minRaiseAmount,
        maxRaiseAmount,
      };
    }
  })

  return viewerActions;
}

module.exports = {
  preflopBets,
  preflopStatuses,
  preflopViewerActions,
};