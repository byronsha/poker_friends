const database = require('../../../database')

module.exports = {
  Mutation: {
    addGroup: async (_, { name }, { user, pubsub }) => {
      const [group] = await database('groups')
        .returning(['id', 'name'])
        .insert({ name, creator_id: user.id });

      await database('players')
        .insert({
          group_id: group.id,
          user_id: user.id,
          bankroll: 0,
          accepted_at: new Date().toJSON(),
        })
        
      pubsub.publish("groupAdded", { groupAdded: { id: group.id, name: group.name } });

      return group;
    },
    acceptGroupInvite: async (_, { groupId }, { user, pubsub }) => {
      const [player] = await database('players')
        .where('user_id', user.id)
        .where('group_id', groupId)
        .where('accepted_at', null);

      if (!player) {
        return { errors: ['Group invite not found'] }
      }

      player.update({ accepted_at: new Date().toJSON() })
      return player;
    }
  },
};