const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const dealBets = (user, currentHand) => {
  return seatNumbers.reduce((acc, i) => {
    if (currentHand[`seat_${i}_info`]) {
      const userId = currentHand[`seat_${i}_id`];
      
      let blindAmount = 0;
      if (userId === currentHand.big_blind_id) {
        blindAmount = currentHand.big_blind_amount;
      } else if (userId === currentHand.small_blind_id) {
        blindAmount = currentHand.big_blind_amount / 2;
      }

      acc[`seat${i}Bet`] = blindAmount;
    }
    return acc;
  }, {});
}

const dealStatuses = currentHand => {
  return seatNumbers.reduce((acc, i) => {
    if (currentHand[`seat_${i}_info`]) {
      acc[`seat${i}Status`] = 'active';
    }
    return acc;
  }, {})
}

const dealViewerActions = (user, currentHand, isViewerTurn, stacks) => {
  let viewerActions = null;

  seatNumbers.forEach(i => {
    if (currentHand[`seat_${i}_id`] === user.id && isViewerTurn) {
      viewerActions = {
        canFold: true,
        canCheck: false,
        callAmount: currentHand.big_blind_amount,
        minRaiseAmount: currentHand.big_blind_amount * 2,
        maxRaiseAmount: stacks[`seat${i}Stack`],
      };
    }
  });

  return viewerActions;
}

module.exports = {
  dealBets,
  dealStatuses,
  dealViewerActions,
}