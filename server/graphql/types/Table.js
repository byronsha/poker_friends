const Table = `
  type Table { 
    entityId: String!
    name: String!
    group: Group!
    creator: User!
    smallBlindAmount: Int!
    bigBlindAmount: Int!
    maxPlayers: Int!
    messages: [Message!]
    currentSeats: [Seat!]
    currentHand: Hand
  }

  enum Action {
    raise
    allin
    call
    check
    fold
  }

  extend type Mutation {
    createTable(
      groupEntityId: String!
      name: String!
      smallBlindAmount: Int!
      bigBlindAmount: Int!
      maxPlayers: Int!
    ): Table

    addMessage(body: String!, tableEntityId: String!): Message
    sitAtTable(tableEntityId: String!, seat: Int!, stackAmount: Int!): Boolean
    standFromTable(tableEntityId: String!): Boolean
    makeAction(handEntityId: String!, action: Action!, amount: Int): Boolean
  }

  extend type Subscription {
    messageAdded(tableEntityId: String!): Message
    tableUpdated(tableEntityId: String!): Table
  }
`

module.exports = Table;