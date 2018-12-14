const database = require('../database')
const bcrypt = require('bcrypt')
const jsonwebtoken = require('jsonwebtoken')
const { PostgresPubSub } = require('graphql-postgres-subscriptions')

const pubsub = new PostgresPubSub({
  user: process.env.USER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

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
    },
    signup: async (_, { username, email, password }) => {
      const passwordHash = await bcrypt.hash(password, 10);

      const user = await database('users')
        .returning(['id', 'email'])
        .insert({ username, email, password_hash: passwordHash })

      // return json web token
      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
      )
    },
    login: async (_, { email, password }) => {
      const [user] = await database('users').where({ email })

      if (!user) {
        throw new Error('No user with that email')
      }

      const valid = await bcrypt.compare(password, user.password_hash)
      
      if (!valid) {
        throw new Error('Incorrect password')
      }

      // return json web token
      return jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1y' }
      )
    },
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubsub.asyncIterator('pinAdded'),
    },
  },
}

module.exports = resolvers;