const Group = `
  type Group {
    id: Int!
    entityId: String!
    name: String!
    players: [Player!]
    creator: User!
    viewerJoinedAt: String!
    viewerIsCreator: Boolean!
    tables: [Table!]
  }

  extend type Mutation {
    addGroup(name: String!): Group!
    acceptGroupInvite(groupEntityId: String!): Group
    rejectGroupInvite(groupEntityId: String!): String
    rescindGroupInvite(userEntityId: String!, groupEntityId: String!): String
  }

  extend type Mutation {
    signup (username: String!, email: String!, password: String!): String
    login (email: String!, password: String!): String
  }
`

module.exports = Group