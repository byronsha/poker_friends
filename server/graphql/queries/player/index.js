const database = require('../../../database')

module.exports = {
  Player: {
    name: source => source.username,
    bankroll: source => source.bankroll,
    acceptedAt: source => source.accepted_at && source.accepted_at.toJSON(),
    user: async source => {
      const [user] = await database
        .select('entity_id', 'username', 'email')
        .from('users')
        .where('entity_id', source.userEntityId);

      return user
    }
  }
}