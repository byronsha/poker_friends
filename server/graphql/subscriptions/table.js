const { withFilter } = require('graphql-subscriptions');

module.exports = {
  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        (_, _args, { pubsub }) => pubsub.asyncIterator('messageAdded'),
        (payload, variables) => {
          return payload.messageAdded.tableEntityId === variables.tableEntityId;
        },
      ),
    },
    tableUpdated: {
      subscribe: withFilter(
        (_, args, { pubsub }) => pubsub.asyncIterator('tableUpdated'),
        (payload, variables) => {
          return payload.tableUpdated.tableEntityId === variables.tableEntityId;
        }
      )
    }
  }
}