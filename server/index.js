require('dotenv').config()
const cors = require("cors");
const express = require('express')
const jwt = require('express-jwt')
const jsonWebToken = require('jsonwebtoken');
const bodyParser = require('body-parser')
const { ApolloServer } = require('apollo-server-express')
const { execute, subscribe } = require('graphql')
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { schema, typeDefs } = require('./graphql/schema')
const resolvers = require('./graphql/resolvers')
const database = require('./database')
const { PostgresPubSub } = require('graphql-postgres-subscriptions')

const PORT = process.env.PORT || 3001
const HOST = process.env.HOST || 'localhost'

const pubsub = new PostgresPubSub({
  user: process.env.USER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

const app = express()
app.use(cors())

// auth middleware
// const auth = jwt({
//   secret: process.env.JWT_SECRET,
//   credentialsRequired: false
// })
// app.use(auth)

// const apolloServer = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: async ({ req }) => {
//     if (!req.user) return;

//     const [user] = await database('users').where({
//       id: req.user.id,
//       email: req.user.email,
//     });

//     return { user, pubsub };
//   },
//   formatError: error => {
//     console.log(error);
//     // return new Error('Internal server error');
//   },
// });
// apolloServer.applyMiddleware({ app });

const ws = createServer(app)

ws.listen(PORT, () => {
  console.log(`🚀 Server ready at http://${HOST}:${PORT}`)
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect: (connectionParams, webSocket) => {
        if (connectionParams.authToken) {
          return jsonWebToken.verify(connectionParams.authToken, process.env.JWT_SECRET, {}, async (err, decoded) => {
            const [user] = await database('users').where({
              id: decoded.id,
              email: decoded.email,
            });
  
            if (!user) {
              throw new Error('Unauthorized access');            
            }
            
            return { user, pubsub };
          })
        }

        // throw new Error('Missing auth token!');
      },
    },
    {
      server: ws,
      path: '/subscriptions',
    }
  )
});

// For GraphiQL requests
//
// {
//   "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJieXJvbkBmYWtlLmNvbSIsImlhdCI6MTU0NDYwMzU3MywiZXhwIjoxNTc2MTYxMTczfQ.DMKwdIFo5Uze61K9YAkoSXid6IBAgsW53LNdABBskJY"
// }