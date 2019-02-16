const database = require('../../../database')

module.exports = {
  Group: {
    entityId: group => group.entity_id,
    name: group => group.name,
    players: async group => {
      const players = await database
        .select('users.entity_id AS userEntityId', 'users.username', 'players.bankroll', 'players.accepted_at')
        .from('players')
        .join('users', 'players.user_id', 'users.id')
        .where('players.group_id', group.id)
        .orderBy('players.accepted_at')
      
      return players
    },
    creator: async group => {
      const [creator] = await database
        .select('users.username', 'users.email', 'users.entity_id')
        .from('groups')
        .join('users', 'groups.creator_id', 'users.id')
        .where('groups.id', group.id)

      return creator;
    },
    viewerJoinedAt: async (group, _args, { user }) => {
      const [row] = await database
        .select('accepted_at')
        .from('players')
        .where('group_id', group.id)
        .where('user_id', user.id)
      
      return row.accepted_at.toJSON();
    },
    viewerIsCreator: async (group, _args, { user }) => {
      const [row] = await database
        .select('creator_id')
        .from('groups')
        .where('id', group.id)

      return row.creator_id === user.id;
    },
    tables: async group => {
      const tables = await database
        .select()
        .from('tables')
        .where('group_id', group.id);
      
      return tables;
    }
  }
}