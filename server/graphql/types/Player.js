const Player = `
  type Player {
    name: String!
    bankroll: Int!
    acceptedAt: String
  }

  extend type Mutation {
    addPlayer(groupEntityId: String!, userEntityId: String!, bankroll: Int): Player
  }
`

module.exports = Player;