const GroupInvite = `
  type GroupInvite {
    group: Group!
    createdAt: String!
  }

  extend type Query {
    groupInvite: GroupInvite
  }
`

module.exports = GroupInvite;