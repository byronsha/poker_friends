const { makeExecutableSchema } = require('graphql-tools')
const { gql } = require('apollo-server-express')
const resolvers = require('./resolvers')

const typeDefs = gql`
  type Pin {
    title: String!, link: String!, image: String!, id: Int!
  }

  type Query {
    pins: [Pin]
  }

  type Mutation {
    addPin(title: String!, link: String!, image: String!): Int
    signup (username: String!, email: String!, password: String!): String
    login (email: String!, password: String!): String
  }
  
  type Subscription {
    pinAdded: Pin
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

module.exports = { schema, typeDefs };