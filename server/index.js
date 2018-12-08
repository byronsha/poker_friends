require('dotenv').config()
const cors = require("cors");
const express = require('express')
const bodyParser = require('body-parser')
const { ApolloServer, gql } = require('apollo-server-express')
const { makeExecutableSchema } = require('graphql-tools')
const { execute, subscribe } = require('graphql')
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { PostgresPubSub } = require('graphql-postgres-subscriptions')

const database = require('./database')

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || 'localhost'

const pubsub = new PostgresPubSub({
  user: process.env.USER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

const typeDefs = gql`
  type Pin { title: String!, link: String!, image: String!, id: Int! }
  type Query { pins: [Pin] }
  type Mutation { addPin(title: String!, link: String!, image: String!): Int }
  type Subscription { pinAdded: Pin }
`;

const resolvers = {
  Query: {
    pins: async () => {
      const pins = await database('pins').select()
      return pins
    },
  },
  Mutation: {
    addPin: async (_, { title, link, image }) => {
      const [id] = await database("pins")
        .returning("id")
        .insert({ title, link, image });

      pubsub.publish("pinAdded", { pinAdded: { title, link, image, id } });
      return id;
    }
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator('pinAdded'),
    },
  },
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})
const app = express()
app.use(cors())

const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app });

const ws = createServer(app)

ws.listen(PORT, () => {
  console.log(`🚀 Server ready at http://${HOST}:${PORT}${apolloServer.graphqlPath}`)
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server: ws,
      path: '/subscriptions',
    }
  )
});
