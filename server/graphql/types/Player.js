const Player = `
  type Player {
    name: String!
    bankroll: Int!
    acceptedAt: String
    user: User!
  }

  type RemovePlayerOutput {
    groupEntityId: String!
    userEntityId: String!
  }

  type EditBankrollOutput {
    groupEntityId: String!
    userEntityId: String!
    bankroll: Int!
  }

  extend type Mutation {
    addPlayer(groupEntityId: String!, userEntityId: String!, bankroll: Int): Player
    removePlayer(groupEntityId: String!, userEntityId: String!): RemovePlayerOutput
    editBankroll(groupEntityId: String!, userEntityId: String!, bankroll: Int!): EditBankrollOutput
  }

  extend type Subscription {
    playerAdded(groupEntityId: String!): Player
  }
`

module.exports = Player;