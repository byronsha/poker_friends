const database = require('../../../database')
const currentSeats = require('./currentSeats')
const currentHand = require ('./currentHand')

module.exports = {
  Table: {
    entityId: source => source.entity_id,
    name: source => source.name,
    group: async source => {
      const [group] = await database
        .select()
        .from('groups')
        .where('id', source.group_id);

      return group;
    },
    creator: async source => {
      const [creator] = await database
        .select()
        .from('users')
        .where('id', source.creator_id);

      return creator;
    },
    smallBlindAmount: source => source.small_blind_amount,
    bigBlindAmount: source => source.big_blind_amount,
    maxPlayers: source => source.max_players,
    messages: async source => {
      const messages = await database
        .select()
        .from('messages')
        .where('table_id', source.id)
        .orderBy('created_at')
        .limit(50);

      return messages;
    },
    currentSeats,
    currentHand,
  }
}