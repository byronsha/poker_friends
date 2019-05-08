const database = require('../../../../database')
const { range } = require('lodash');
const Hand = require('pokersolver').Hand;
const sortCards = require('./sortCards');
const initHand = require('./initHand')

const seatNumbers = range(1, 10);

function determineWinner(hand, notFoldedUserIds) {
  const handToUserIdHash = {};

  const hands = seatNumbers.map(i => {
    const userId = hand[`seat_${i}_id`];

    if (userId && notFoldedUserIds.includes(userId)) {
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

  const winnerId = handToUserIdHash[winningCards]
  return { winnerId, winningHandText: winner[0].descr };
}

module.exports = async (hand, table, pubsub, user) => {
  const actions = await database('actions')
    .where('hand_id', hand.id)
    .orderBy('index', 'DESC');

  const lastAction = actions[0];

  const userIds = seatNumbers.map(i => hand[`seat_${i}_id`]).filter(Boolean);
  const notFoldedUserIds = userIds.filter(userId =>
    !actions.find(a => a.action === 'fold' && a.user_id === userId)
  )
  
  let winnerId;
  let winningHandText = '';

  if (notFoldedUserIds.length === 1) {
    winnerId = notFoldedUserIds[0]
  } else {
    ({ winnerId, winningHandText } = determineWinner(hand, notFoldedUserIds));
  }

  const [winner] = await database('users')
    .where('id', winnerId);

  const seatInfo = seatNumbers.reduce((acc, i) => {
    const userId = hand[`seat_${i}_id`];
    const info = hand[`seat_${i}_info`];
    const endStack = lastAction[`seat_${i}_stack`];
    const mainPot = lastAction.main_pot;

    if (userId && info && endStack !== null) {
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
    .update('main_pot', lastAction.main_pot)
    .update(seatInfo)

  const [newMessage] = await database('messages')
    .returning(['id'])
    .insert({
      body: `${winner.username} wins $${lastAction.main_pot}${winningHandText ? ` - ${winningHandText}` : ''}`,
      table_id: table.id,
      user_id: null,
    })

  const [message] = await database('messages')
    .select()
    .where('id', newMessage.id)

  pubsub.publish('messageAdded', {
    messageAdded: {
      ...message,
      tableEntityId: table.entity_id,
    }
  });

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
  }, 3000);
}

// TO UPDATE:
// winners
// is_completed
// main_pot
// side_pots
// went_to_showdown