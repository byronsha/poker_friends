const Viewer = `
  type Viewer {
    id: Int!
    username: String!
    email: String!
    groups: [Group!]!
  }

  extend type Query {
    viewer: Viewer
  }
`

module.exports = Viewer;