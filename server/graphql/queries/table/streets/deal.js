const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
  dealStatuses,
  dealViewerActions,
}