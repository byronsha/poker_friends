const { keyBy, camelCase, range } = require('lodash')
const database = require('../../../../database')
const Deck = require('../../../../poker/Deck');

const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function camelizeKeys(object) {
  const newObject = {}

  Object.keys(object).forEach(key => {
    newObject[camelCase(key)] = object[key];
  });

  return newObject;
}

// players[0] will always be the button after rotating
function orderPlayersByTurn(players, lastHand) {
  let orderedPlayers = players.slice().sort((a, b) => a.seat - b.seat);

  if (lastHand && !lastHand.end_of_session) {
    const orderedSeats = players.map(p => p.seat).sort();
    const lastButtonSeat = seatNumbers.find(i =>
      lastHand[`seat_${i}_id`] === lastHand.button_id
    );
    const rotateIdx = orderedSeats.indexOf(lastButtonSeat) + 1;
    return [...orderedPlayers.slice(rotateIdx), ...orderedPlayers.slice(0, rotateIdx)]
  }

  return orderedPlayers;
}

module.exports = async function initHand(table, players, pubsub, user) {
  const [lastHand] = await database('hands')
    .where('table_id', table.id)
    .orderBy('created_at', 'DESC')
    .limit(1);

  const orderedPlayers = orderPlayersByTurn(players, lastHand);

  const playerHash = keyBy(players, 'seat');
  const isHeadsUp = players.length === 2;
  const buttonPlayer = orderedPlayers[0];
  const smallBlindPlayer = isHeadsUp ? orderedPlayers[0] : orderedPlayers[1];
  const bigBlindPlayer = isHeadsUp ? orderedPlayers[1] : orderedPlayers[2];
  let playerToAct;
  
  if (isHeadsUp) {
    playerToAct = buttonPlayer;
  } else if (players.length > 2) {
    playerToAct = players[3]
  } else {
    throw new Error('Could not set playerToAct')
  }

  const deck = new Deck();

  const seats = seatNumbers.reduce((acc, i) => {
    const player = players.find(p => p.seat === i)

    if (player) {
      const cards = [deck.draw(), deck.draw()]
      const hand = cards.map(c => `${c.rank}${c.suit}`)

      let stackAmount = player.stackAmount;

      if (lastHand && !lastHand.end_of_session) {
        stackAmount = lastHand[`seat_${i}_info`].end_stack;
      }

      const info = {
        hand,
        start_stack: stackAmount,
        end_stack: null,
      }

      acc[`seat_${i}_id`] = player.userId;
      acc[`seat_${i}_info`] = JSON.stringify(info);
    }

    return acc;
  }, {});

  const stacks = seatNumbers.reduce((acc, i) => {
    const player = players.find(p => p.seat === i)

    if (player) {
      let stackAmount = player.stackAmount;

      if (lastHand && !lastHand.end_of_session) {
        stackAmount = lastHand[`seat_${i}_info`].end_stack;
      }

      if (player.userId === smallBlindPlayer.userId) {
        acc[`seat_${i}_stack`] = stackAmount - table.small_blind_amount;
      } else if (player.userId === bigBlindPlayer.userId) {
        acc[`seat_${i}_stack`] = stackAmount - table.big_blind_amount;
      } else {
        acc[`seat_${i}_stack`] = stackAmount;
      }
    }

    return acc;
  }, {});

  const bets = seatNumbers.reduce((acc, i) => {
    const player = players.find(p => p.seat === i)

    if (player) {
      if (player.userId === smallBlindPlayer.userId) {
        acc[`seat_${i}_bet`] = table.small_blind_amount;
      } else if (player.userId === bigBlindPlayer.userId) {
        acc[`seat_${i}_bet`] = table.big_blind_amount;
      } else {
        acc[`seat_${i}_bet`] = 0;
      }
    }

    return acc;
  }, {});

  const statuses = seatNumbers.reduce((acc, i) => {
    const player = players.find(p => p.seat === i)

    if (player) {
      acc[`seat_${i}_status`] = 'active';
    }

    return acc;
  }, {});

  const board = range(5).map(_ => {
    const card = deck.draw();
    return `${card.rank}${card.suit}`;
  });

  const [hand] = await database('hands')
    .returning(['id', 'entity_id'])
    .insert({
      table_id: table.id,
      big_blind_amount: table.big_blind_amount,
      button_id: buttonPlayer.userId,
      small_blind_id: smallBlindPlayer.userId,
      big_blind_id: bigBlindPlayer.userId,
      is_completed: false,
      end_of_session: false,
      board: JSON.stringify(board),
      ...seats,
    })

  await database('actions')
    .insert({
      hand_id: hand.id,
      index: 0,
      next_user_id: playerToAct.userId,
      street: 'deal',
      main_pot: table.big_blind_amount + table.small_blind_amount,
      next_turn_min_raise: table.big_blind_amount * 2,
      end_of_street: true,
      ...stacks,
    })

  let viewerCards;
  seatNumbers.forEach(i => {
    if (seats[`seat_${i}_id`] && seats[`seat_${i}_id`] === user.id) {
      viewerCards = seats[`seat_${i}_info`].hand;
    }
  })

  const isViewerTurn = playerToAct.userId === user.id;
  let viewerActions = null;

  if (isViewerTurn) {
    seatNumbers.forEach(i => {
      const seatUserId = seats[`seat_${i}_id`];

      if (seatUserId && seatUserId === user.id) {
        viewerActions = {
          canFold: true,
          canCheck: false,
          callAmount: table.big_blind_amount / 2,
          minRaiseAmount: table.big_blind_amount * 2,
          maxRaiseAmount: stacks[`seat_${i}_stack`],
        };
      }
    })
  }

  setTimeout(() => {
    pubsub.publish('tableUpdated', {
      tableUpdated: {
        currentHand: {
          entityId: hand.entity_id,
          stacks: {
            ...camelizeKeys(stacks),
          },
          bets: {
            ...camelizeKeys(bets),
          },
          statuses: {
            ...camelizeKeys(statuses),
          },
          board: [],
          mainPot: table.big_blind_amount + table.small_blind_amount,
          sidePots: [],
          viewerCards,
          isViewerTurn: playerToAct.userId === user.id,
          viewerActions,
        },
        id: table.id,
        tableEntityId: table.entity_id,
      },
    })
  }, 5000);
}