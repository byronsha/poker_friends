import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from "react-apollo";
import { Spinner } from "apollo-subscription-example-components";
import gql from "graphql-tag";

const GROUP_QUERY = gql`
  query GroupQuery($groupEntityId: String!) {
    viewer {
      group(entityId: $groupEntityId) {
        name
        entityId
        viewerIsCreator
        players {
          name
          bankroll
          acceptedAt
          user {
            entityId
          }
        }
        tables {
          name
          entityId
          smallBlindAmount
          bigBlindAmount
          maxPlayers
        }
      }
    }
  }
`;

// const GROUP_SUBSCRIPTION = gql`
//   subscription PlayerAddedSubscription($groupEntityId: String!) {
//     playerAdded(groupEntityId: $groupEntityId) {
//       name
//       bankroll
//       acceptedAt
//     }
//   }
// `;

const GroupQuery = props => {
  const groupEntityId = props.match.params.groupEntityId;
  
  return (
    <Query query={GROUP_QUERY} variables={{ groupEntityId }}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) {
          return (
            <div style={{ paddingTop: 20 }}>
              <Spinner show />
            </div>
          );
        }
        if (error) return <p>Error :(</p>;
        const subscribeToMorePlayers = () => {
          // subscribeToMore({
          //   document: GROUP_SUBSCRIPTION,
          //   variables: { groupEntityId },
          //   updateQuery: (prev, { subscriptionData }) => {
          //     if (!subscriptionData.data || !subscriptionData.data.playerAdded)
          //       return prev;
          //     const newPlayerAdded = subscriptionData.data.playerAdded;

          //     return Object.assign({}, prev, {
          //       viewer: {
          //         ...prev.viewer,
          //         group: {
          //           ...prev.viewer.group,
          //           players: [
          //             ...prev.viewer.group.players,
          //             newPlayerAdded,
          //           ],
          //         },
          //       }
          //     });
          //   }
          // });
        };

        return props.children(data, subscribeToMorePlayers);
      }}
    </Query>
  )
}

export default withRouter(GroupQuery);