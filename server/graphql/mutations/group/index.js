const database = require('../../../database')

module.exports = {
  Mutation: {
    addGroup: async (_, { name }, { user, pubsub }) => {
      const [group] = await database('groups')
        .returning(['id', 'name'])
        .insert({ name, creator_id: user.id });

      await database('players')
        .insert({ group_id: group.id, user_id: user.id, bankroll: 0 })
        
      pubsub.publish("groupAdded", { groupAdded: { id: group.id, name: group.name } });

      return group;
    },
  },
};