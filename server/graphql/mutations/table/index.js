const database = require('../../../database')
const sitAtTable = require('./mutations/sitAtTable');
const standFromTable = require('./mutations/standFromTable');

module.exports = {
  Mutation: {
    createTable: async (
      _,
      {
        groupEntityId,
        name,
        smallBlindAmount,
        bigBlindAmount,
        maxPlayers
      },
      { user },
    ) => {
      const [player] = await database('players')
        .select('players.id', 'players.group_id')
        .join('groups', 'players.group_id', 'groups.id')
        .where('players.user_id', user.id)
        .where('groups.entity_id', groupEntityId);

      if (!player) {
        return { errors: ['Player not in group'] }
      }

      const [table] = await database('tables')
        .returning(['id'])
        .insert({
          group_id: player.group_id,
          name,
          creator_id: user.id,
          small_blind_amount: smallBlindAmount,
          big_blind_amount: bigBlindAmount,
          max_players: maxPlayers,
        });

      const [newTable] = await database('tables')
        .where('id', table.id)

      return newTable;
    },
    addMessage: async (_, { body, tableEntityId }, { user, pubsub }) => {
      const [table] = await database('tables')
        .where('entity_id', tableEntityId);

      if (!table) {
        return { errors: ['Table not found'] }
      }

      const [newMessage] = await database('messages')
        .returning(['id'])
        .insert({
          body,
          table_id: table.id,
          user_id: user.id,
        });

      const [message] = await database('messages')
        .select()
        .where('id', newMessage.id);
      
      pubsub.publish('messageAdded', {
        messageAdded: {
          ...message,
          tableEntityId,
        }
      });

      return message;
    },
    sitAtTable,
    standFromTable,
  }
}