const { withFilter } = require('graphql-subscriptions');

module.exports = {
  Subscription: {
    playerAdded: {
      subscribe: withFilter(
        (_, _args, { pubsub }) => pubsub.asyncIterator('playerAdded'),
        (payload, variables) => {
          return payload.playerAdded.groupEntityId === variables.groupEntityId
        },
      ),
    }
  }
}