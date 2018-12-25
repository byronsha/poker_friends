const database = require('../../../database')

module.exports = {
  Player: {
    name: source => source.username,
    bankroll: source => source.bankroll,
    acceptedAt: source => source.accepted_at.toJSON(),
  }
}