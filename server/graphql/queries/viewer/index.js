const database = require('../../../database')

module.exports = {
  Query: {
    viewer: (_, _args, { user }) => user,    
  },
  Viewer: {
    groups: async (_, _args, { user }) => {
      const rows = await database
        .select('groups.id', 'groups.name')
        .from('groups')
        .join('players', 'groups.id', 'players.group_id')
        .where('players.user_id', user.id)

      return rows;
    }
  },
}