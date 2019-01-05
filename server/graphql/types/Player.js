const Player = `
  type Player {
    name: String!
    bankroll: Int!
    acceptedAt: String
  }

  type RemovePlayerOutput {
    groupEntityId: String!
    userEntityId: String!
  }

  extend type Mutation {
    addPlayer(groupEntityId: String!, userEntityId: String!, bankroll: Int): Player
    removePlayer(groupEntityId: String!, userEntityId: String!): RemovePlayerOutput
  }

  extend type Subscription {
    playerAdded(groupEntityId: String!): Player
  }
`

module.exports = Player;