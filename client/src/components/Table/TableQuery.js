import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { Spinner } from 'apollo-subscription-example-components';
import gql from 'graphql-tag';

const TABLE_QUERY = gql`
  query TableQuery($tableEntityId: String!) {
    viewer {
      table(entityId: $tableEntityId) {
        name
        entityId
        maxPlayers
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
      }
    }
  }
`;

const TABLE_SUBSCRIPTION = gql`
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

const TableQuery = props => {
  const tableEntityId = props.match.params.tableEntityId;

  return (
    <Query query={TABLE_QUERY} variables={{ tableEntityId }}>
      {({ loading, error, data, subscribeToMore }) => {
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
            document: TABLE_SUBSCRIPTION,
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

        return props.children(data.viewer, subscribeToMoreMessages);
      }}
    </Query>
  )
}

export default withRouter(TableQuery);