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
    sitAtTable(tableEntityId: String!, seat: Int!): Boolean
    standFromTable(tableEntityId: String!): Boolean
  }

  extend type Subscription {
    messageAdded(tableEntityId: String!): Message
  }
`

module.exports = Table;