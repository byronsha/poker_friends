const Group = `
  type Group {
    id: Int!
    entityId: String!
    name: String!
    players: [Player!]
    creator: User!
    viewerJoinedAt: String!
  }

  extend type Mutation {
    addGroup(name: String!): Group!
    acceptGroupInvite(groupId: Int!): Group
  }


  type Pin {
    title: String!, link: String!, image: String!, id: Int!
  }

  extend type Query {
    pins: [Pin]
  }

  extend type Mutation {
    addPin(title: String!, link: String!, image: String!): Int
    signup (username: String!, email: String!, password: String!): String
    login (email: String!, password: String!): String
  }

  extend type Subscription {
    pinAdded: Pin
  }
`

module.exports = Group