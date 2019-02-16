const database = require('../../../database')

module.exports = {
  Query: {
    viewer: (_, _args, { user }) => user,
  },
  Viewer: {
    group: async (_, { entityId }, { user }) => {
      const [group] = await database
        .select('id', 'entity_id', 'name')
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
    table: async (_, { entityId }, { user }) => {
      const [table] = await database
        .select('tables.*')
        .from('tables')
        .join('groups', 'groups.id', 'tables.group_id')
        .join('players', 'players.group_id', 'groups.id')
        .where('tables.entity_id', entityId)
        .where('players.user_id', user.id);

      return table;        
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
        .select('groups.id', 'players.created_at')
        .from('groups')
        .join('players', 'groups.id', 'players.group_id')
        .where('players.user_id', user.id)
        .where('players.accepted_at', null)

      return rows;
    },
    searchUsers: async (_, { query }) => {
      if (!query) return [];

      const users = await database
        .select('entity_id', 'username', 'email')
        .from('users')
        .where('username', 'LIKE', `%${query}%`)
        .orWhere('email', 'LIKE', `%${query}%`)
        .limit(10)

      return users;
    }
  },
}