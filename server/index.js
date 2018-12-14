require('dotenv').config()
const cors = require("cors");
const express = require('express')
const jwt = require('express-jwt')
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const { execute, subscribe } = require('graphql')
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { schema, typeDefs } = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || 'localhost'

const app = express()
app.use(cors())

// auth middleware
const auth = jwt({
  secret: process.env.JWT_SECRET,
  credentialsRequired: false
})
app.use(auth)

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // get the user token from the headers
    const token = req.headers.authorization || '';

    console.log('TOKEN', req.headers)
    // try to retrieve a user with the token
    // const user = getUser(token);

    // add the user to the context
    // return { user };
  },
});
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
