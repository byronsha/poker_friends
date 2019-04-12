import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { Spinner } from 'apollo-subscription-example-components';
import gql from 'graphql-tag';

const seatNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const seatsAndHandsFragment = `
  currentSeats {
    number
    stackAmount
    isViewer
    user {
      username
    }
  }
  currentHand {
    stacks {
      ${seatNumbers.map(i => `seat${i}Stack`)}
    }
    bets {
      ${seatNumbers.map(i => `seat${i}Bet`)}            
    }
    statuses {
      ${seatNumbers.map(i => `seat${i}Status`)}
    }
    entityId
    board
    mainPot
    viewerCards
    isViewerTurn
    viewerActions {
      canFold
      canCheck
      callAmount
      minRaiseAmount
      maxRaiseAmount
    }
  }
`;

const TABLE_QUERY = gql`
  query TableQuery($tableEntityId: String!) {
    viewer {
      table(entityId: $tableEntityId) {
        name
        entityId
        maxPlayers
        bigBlindAmount
        group {
          name
          entityId
        }
        messages {
          body
          createdAt
          author {
            username
          }
        }
        ${seatsAndHandsFragment}
      }
    }
  }
`;

const MESSAGES_SUBSCRIPTION = gql`
  subscription MessageAddedSubscription($tableEntityId: String!) {
    messageAdded(tableEntityId: $tableEntityId) {
      body
      createdAt
      author {
        username
      }
    }
  }
`;

const TABLE_UPDATES_SUBSCRIPTION = gql`
  subscription TableUpdatedSubscription($tableEntityId: String!) {
    tableUpdated(tableEntityId: $tableEntityId) {
      ${seatsAndHandsFragment}
    }
  }
`;

const TableQuery = props => {
  const tableEntityId = props.match.params.tableEntityId;

  return (
    <Query query={TABLE_QUERY} variables={{ tableEntityId }}>
      {({ loading, error, data, subscribeToMore, refetch }) => {
        if (loading) {
          return (
            <div style={{ paddingTop: 20 }}>
              <Spinner show />
            </div>
          );
        }
        if (error) return <p>Error :(</p>;
        
        const subscribeToMoreMessages = () => {
          subscribeToMore({
            document: MESSAGES_SUBSCRIPTION,
            variables: { tableEntityId },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data || !subscriptionData.data.messageAdded)
                return prev;
              
              const newMessageAdded = subscriptionData.data.messageAdded;

              return Object.assign({}, prev, {
                viewer: {
                  ...prev.viewer,
                  table: {
                    ...prev.viewer.table,
                    messages: [
                      ...prev.viewer.table.messages,
                      newMessageAdded,
                    ],
                  },
                }
              });
            }
          });
        }

        const subscribeToTableUpdates = () => {
          subscribeToMore({
            document: TABLE_UPDATES_SUBSCRIPTION,
            variables: { tableEntityId },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data || !subscriptionData.data.tableUpdated)
                return prev;

              const updatedTable = subscriptionData.data.tableUpdated;

              // if (!updatedTable.currentHand) {
              //   console.log('BEFORE', updatedTable)

              //   refetch().then(data => {
              //     console.log('SUCCESS', data)
              //     return data;
              //   });
              // }

              return Object.assign({}, prev, {
                viewer: {
                  ...prev.viewer,
                  table: {
                    ...prev.viewer.table,
                    currentSeats: updatedTable.currentSeats,
                    currentHand: updatedTable.currentHand,
                  },
                }
              });
            }
          });
        }

        return props.children(data.viewer, subscribeToMoreMessages, subscribeToTableUpdates);
      }}
    </Query>
  )
}

export default withRouter(TableQuery);