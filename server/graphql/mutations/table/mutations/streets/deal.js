function calcAmountAddedToBet({ action, amount, user, hand }) {
  if (action === 'raise' || action === 'call') {
    if (hand.big_blind_id === user.id) {
      return amount - hand.big_blind_amount;
    } else if (hand.small_blind_id === user.id) {
      return amount - hand.big_blind_amount / 2;
    }
  }

  return amount;
}

function calcNextTurnMinRaise({ action, amount, hand }) {
  if (action === 'raise') {
    const amountRaised = amount - hand.big_blind_amount;
    return amount + amountRaised;
  }

  return hand.big_blind_amount * 2;
}

module.exports = function calcDeal(args) {
  return {
    nextTurnMinRaise: calcNextTurnMinRaise(args),
    amountAddedToBet: calcAmountAddedToBet(args),
  }
}