const database = require('../../../database')

module.exports = {
  Group: {
    id: group => group.id,
    entityId: group => group.entity_id,
    name: group => group.name,
    players: async group => {
      const players = await database
        .select('users.username', 'players.bankroll', 'players.accepted_at')
        .from('players')
        .join('users', 'players.user_id', 'users.id')
        .where('players.group_id', group.id)
        .orderBy('players.accepted_at')

      return players
    }
  }
}