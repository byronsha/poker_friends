const { keyBy, camelCase } = require('lodash')
const database = require('../../../../database')

const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function camelizeKeys(object) {
  const newObject = {}

  Object.keys(object).forEach(key => {
    newObject[camelCase(key)] = object[key];
  });

  return newObject;
}

async function initHand(table, pokerTables, pubsub) {
  const players = pokerTables.players(table.id);
  const playerHash = keyBy(players, 'seat');
  const isHeadsUp = players.length === 2;
  const buttonPlayer = players[0];
  const smallBlindPlayer = isHeadsUp ? players[0] : players[1];
  const bigBlindPlayer = isHeadsUp ? players[1] : players[2];

  const deck = pokerTables.newDeck();

  const seats = seatNumbers.reduce((acc, i) => {
    const player = players.find(p => p.seat === i)

    if (player) {
      const cards = [deck.draw(), deck.draw()]
      const hand = cards.map(c => `${c.rank}${c.suit}`)
  
      const info = {
        hand,
        start_stack: player.stackAmount,
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
      if (player.userId === smallBlindPlayer.userId) {
        acc[`seat_${i}_stack`] = player.stackAmount - table.small_blind_amount;
      } else if (player.userId === bigBlindPlayer.userId) {
        acc[`seat_${i}_stack`] = player.stackAmount - table.big_blind_amount;
      } else {
        acc[`seat_${i}_stack`] = player.stackAmount;
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

  const [hand] = await database('hands')
    .returning(['id'])
    .insert({
      table_id: table.id,
      big_blind_amount: table.big_blind_amount,
      button_id: buttonPlayer.userId,
      small_blind_id: smallBlindPlayer.userId,
      big_blind_id: bigBlindPlayer.userId,
      is_completed: false,
      end_of_session: false,
      ...seats,
    })
  
  await database('actions')
    .insert({
      hand_id: hand.id,
      index: 0,
      next_user_id: buttonPlayer.userId,
      street: 'deal',
      main_pot: table.big_blind_amount + table.small_blind_amount,
      next_turn_min_raise: table.big_blind_amount,
      ...stacks,
    })

  setTimeout(() => {
    pubsub.publish('tableUpdated', {
      tableUpdated: {
        currentHand: {
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
        },
        id: table.id,
        tableEntityId,
      },
    })
  }, 5000);
}

module.exports = async (_, { tableEntityId, seat, stackAmount }, { user, pubsub, pokerTables }) => {
  const [table] = await database('tables')
    .where('entity_id', tableEntityId);

  pokerTables.sitPlayer(user.id, table.id, seat, stackAmount);
  
  const players = pokerTables.players(table.id);
  const seatedPlayers = players.map(p => ({ ...p, isViewer: p.userId === user.id }));

  pubsub.publish('tableUpdated', {
    tableUpdated: {
      currentSeats: seatedPlayers,
      id: table.id,
      tableEntityId,
    },
  });

  if (seatedPlayers.length > 1) {
    setTimeout(() => initHand(table, pokerTables, pubsub), 5000);
  }

  return true
}