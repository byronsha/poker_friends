const database = require('../../../../database')
const { range } = require('lodash');
const Hand = require('pokersolver').Hand;
const sortCards = require('./sortCards');
const initHand = require('./initHand')

const seatNumbers = range(1, 10);

function determineWinner(hand) {
  const handToUserIdHash = {};

  const hands = seatNumbers.map(i => {
    const userId = hand[`seat_${i}_id`];

    if (userId) {
      const playerCards = hand[`seat_${i}_info`].hand;
      const playerAndBoardCards = [...hand.board, ...playerCards].sort(sortCards);

      const cardString = playerAndBoardCards.join(',');
      handToUserIdHash[cardString] = userId;

      return Hand.solve(playerAndBoardCards);
    }
  });

  const winner = Hand.winners(hands.filter(Boolean));
  const winningCards = winner[0].cardPool
    .map(card => `${card.value}${card.suit}`)
    .sort(sortCards).join(',');

  return handToUserIdHash[winningCards];
  
  // var hand = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', 'Qs', 'Qd']);
  // console.log(hand.name); // Two Pair
  // console.log(hand.descr); // Two Pair, A's & Q's
}

module.exports = async (hand, table, pubsub, user) => {
  const [lastAction] = await database('actions')
    .where('hand_id', hand.id)
    .orderBy('index', 'DESC')
    .limit(1);

  const winnerId = determineWinner(hand)

  const seatInfo = seatNumbers.reduce((acc, i) => {
    const userId = hand[`seat_${i}_id`];
    const info = hand[`seat_${i}_info`];
    const endStack = lastAction[`seat_${i}_stack`];
    const mainPot = lastAction.main_pot;

    if (userId && info && endStack) {
      acc[`seat_${i}_info`] = {
        ...info,
        end_stack: userId === winnerId ? endStack + mainPot : endStack,
      }
    }

    return acc;
  }, {})

  await database('hands')
    .where('id', hand.id)  
    .update('winners', winnerId)
    .update('is_completed', true)
    .update(seatInfo)

  pubsub.publish('tableUpdated', {
    tableUpdated: {
      id: table.id,
      tableEntityId: table.entity_id,
    },
  });

  setTimeout(async () => {
    const players = await database('table_buyins')
      .where('table_id', table.id)
      .where('cash_out', null)

    const seatedPlayers = players.map(p => ({
      seat: p.seat,
      stackAmount: p.buy_in,
      userId: p.user_id,
      isViewer: p.user_id === user.id,
    }));

    initHand(table, seatedPlayers, pubsub, user);
  }, 5000);
}

// TO UPDATE:
// winners
// is_completed
// main_pot
// side_pots
// went_to_showdown