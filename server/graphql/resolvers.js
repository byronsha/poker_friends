const database = require('../database')
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken')
const { merge } = require('lodash')
// queries
const viewer = require('./queries/viewer')
const user = require('./queries/user')
const group = require('./queries/group')
const groupInvite = require('./queries/groupInvite')
const player = require('./queries/player')
const table = require('./queries/table')
const message = require('./queries/message')
const seat = require('./queries/seat')
// mutations
const groupMutation = require('./mutations/group')
const playerMutation = require('./mutations/player')
const tableMutation = require('./mutations/table')
// subscriptions
const playerSubscription = require('./subscriptions/player')
const tableSubscription = require('./subscriptions/table')

const resolvers = {
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const [user] = await database('users')
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

      const valid = await bcrypt.compareSync(password, user.password_hash)
      
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
}

const mergedResolvers = merge(
  // temp
  resolvers,
  // queries
  viewer,
  user,
  group,
  groupInvite,
  player,
  table,
  message,
  seat,
  // mutations
  groupMutation,
  playerMutation,
  tableMutation,
  // subscriptions
  playerSubscription,
  tableSubscription,
)

module.exports = mergedResolvers;