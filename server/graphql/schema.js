const { makeExecutableSchema } = require('graphql-tools')
const { gql } = require('apollo-server-express')
const resolvers = require('./resolvers')
const Viewer = require('./types/Viewer')
const User = require('./types/User')
const Group = require('./types/Group')
const GroupInvite = require('./types/GroupInvite')
const Player = require('./types/Player')

const Root = /* GraphQL */ `
  # The dummy queries and mutations are necessary because
  # graphql-js cannot have empty root types and we only extend
  # these types later on
  # Ref: apollographql/graphql-tools#293

  type Query {
    dummy: String
  }

  type Mutation {
    dummy: String
  }

  type Subscription {
    dummy: String
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;

const typeDefs = [
  Root,
  Viewer,
  User,
  Group,
  GroupInvite,
  Player,
]

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

module.exports = { schema, typeDefs };