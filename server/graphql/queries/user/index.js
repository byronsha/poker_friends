const database = require('../../../database')

module.exports = {
  User: {
    entityId: source => source.entity_id,
    username: source => source.username,
    email: source => source.email,
  }
}