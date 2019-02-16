const database = require('../../../database')

module.exports = {
  Mutation: {
    addGroup: async (_, { name }, { user, pubsub }) => {
      const [group] = await database('groups')
        .returning(['id', 'entity_id', 'name'])
        .insert({ name, creator_id: user.id });

      await database('players')
        .insert({
          group_id: group.id,
          user_id: user.id,
          bankroll: 0,
          accepted_at: new Date().toJSON(),
        })
        
      return group;
    },
    acceptGroupInvite: async (_, { groupEntityId }, { user, pubsub }) => {
      const [player] = await database('players')
        .select('players.id')
        .join('groups', 'players.group_id', 'groups.id')
        .where('players.user_id', user.id)
        .where('groups.entity_id', groupEntityId)
        .where('players.accepted_at', null);

      if (!player) {
        return { errors: ['Group invite not found'] }
      }

      const now = new Date().toJSON()

      await database('players')
        .update({ accepted_at: now })
        .where('id', player.id)

      const [group] = await database('groups')
        .where('entity_id', groupEntityId);

      return group;
    },
    rejectGroupInvite: async (_, { groupEntityId }, { user }) => {
      const [player] = await database('players')
        .select('players.id')
        .join('groups', 'players.group_id', 'groups.id')
        .where('players.user_id', user.id)
        .where('groups.entity_id', groupEntityId)
        .where('players.accepted_at', null);

      if (!player) {
        return { errors: ['Invite not found'] }
      }

      await database('players')
        .delete()
        .where('id', player.id);

      return groupEntityId
    },
    rescindGroupInvite: async (_, { userEntityId, groupEntityId }) => {
      const [player] = await database('players')
        .select('players.id')
        .join('groups', 'players.group_id', 'groups.id')
        .join('users', 'players.user_id', 'users.id')
        .where('users.entity_id', userEntityId)
        .where('groups.entity_id', groupEntityId)

      if (!player) {
        return { errors: ['Invite not found'] }
      }

      await database('players')
        .delete()
        .where('id', player.id)

      return groupEntityId
    },
  },
};