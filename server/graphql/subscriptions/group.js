module.exports = {
  Subscription: {
    groupAdded: {
      subscribe: (_, _args, { pubsub }) => pubsub.asyncIterator('groupAdded'),
    },
  },
}