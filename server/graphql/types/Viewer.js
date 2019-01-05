const Viewer = `
  type Viewer {
    id: Int!
    username: String!
    email: String!
    group(entityId: String): Group
    groups: [Group!]!
    groupInvites: [GroupInvite!]!
    searchUsers(query: String): [User!]!
  }

  extend type Query {
    viewer: Viewer
  }
`

module.exports = Viewer;