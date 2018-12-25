const database = require('../../../database')

module.exports = {
  Query: {
    viewer: (_, _args, { user }) => user,    
  },
  Viewer: {
    group: async (_, { entityId }, { user }) => {
      const [group] = await database
        .select('id', 'name')
        .from('groups')
        .where('entity_id', entityId)
        .whereExists(
          database.select('id')
            .from('players')
            .where('user_id', user.id)
            .whereRaw('group_id = groups.id')
        )
      
      return group
    },
    groups: async (_, _args, { user }) => {
      const rows = await database
        .select('groups.id', 'groups.entity_id', 'groups.name')
        .from('groups')
        .join('players', 'groups.id', 'players.group_id')
        .where('players.user_id', user.id)
        .whereNot('players.accepted_at', null)

      return rows;
    },
    groupInvites: async (_, _args, { user }) => {
      const rows = await database
        .select('groups.id', 'groups.entity_id', 'groups.name')
        .from('groups')
        .join('players', 'groups.id', 'players.group_id')
        .where('players.user_id', user.id)
        .where('players.accepted_at', null)

      return rows;
    },
    searchUsers: async (_, { query }) => {
      const users = await database
        .select('entity_id', 'username', 'email')
        .from('users')
        .where('username', 'like', `%${query}%`)
        .limit(10)

      return users;
    }
  },
}