const database = require('../../../../database')
const { range } = require('lodash');
const Hand = require('pokersolver').Hand;

const seatNumbers = range(1, 10);

const SUITS = ['s', 'd', 'h', 'c'];
const RANKS = ['A', 'K', 'Q', 'J', 'T'];

function sortSuits(a, b) {
  return SUITS.indexOf(a) - SUITS.indexOf(b);
}

function sortRanks(a, b) {
  if (RANKS.includes(a) && !RANKS.includes(b)) return -1;
  if (RANKS.includes(b) && !RANKS.includes(a)) return 1;
  return RANKS.indexOf(a) - RANKS.indexOf(b);
}

function sortCards(a, b) {
  let [rankA, suitA] = a.split('')
  let [rankB, suitB] = b.split('')

  if (rankA === rankB) {
    return sortSuits(suitA, suitB)
  }

  if (RANKS.includes(rankA) || RANKS.includes(rankB)) {
    return sortRanks(rankA, rankB)
  }
  
  return parseInt(rankB) - parseInt(rankA);
}

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

  console.log({ winner });

  return handToUserIdHash[winningCards];
  

  // var hand = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', 'Qs', 'Qd']);
  // console.log(hand.name); // Two Pair
  // console.log(hand.descr); // Two Pair, A's & Q's
}

module.exports = async (handId, pubsub) => {
  const [hand] = await database('hands')
    .where('id', handId)

  const [lastAction] = await database('actions')
    .where('hand_id', handId)
    .orderBy('index', 'DESC')
    .limit(1);

  const winnerId = determineWinner(hand)

  console.log({ winnerId })

  await database('hands')
    .where('id', handId)  
    .update('winners', winnerId)
    .update('is_completed', true)

  const [table] = await database('tables')
    .where('id', hand.table_id);

  pubsub.publish('tableUpdated', {
    tableUpdated: {
      id: table.id,
      tableEntityId: table.entity_id,
    },
  });

  // TO UPDATE:
  // winners
  // is_completed
  // main_pot
  // side_pots
  // went_to_showdown
}