import React from 'react';
import { Query } from "react-apollo";
import { Spinner } from "apollo-subscription-example-components";
import gql from "graphql-tag";

const GROUPS_QUERY = gql`
  {
    viewer {
      groups {
        id
        entityId
        name
      }
    }
  }
`;

const GROUPS_SUBSCRIPTION = gql`
  subscription {
    groupAdded {
      id
      entityId
      name
    }
  }
`;

const GroupsQuery = ({ children }) => (
  <Query query={GROUPS_QUERY}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading) {
        return (
          <div style={{ paddingTop: 20 }}>
            <Spinner show />
          </div>
        );
      }
      if (error) return <p>Error :(</p>;
      const subscribeToMoreGroups = () => {
        subscribeToMore({
          document: GROUPS_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data || !subscriptionData.data.groupAdded)
              return prev;
            const newGroupAdded = subscriptionData.data.groupAdded;

            return Object.assign({}, prev, {
              viewer: {
                ...prev.viewer,
                groups: [...prev.viewer.groups, newGroupAdded],
              }
            });
          }
        });
      };

      return children(data, subscribeToMoreGroups);
    }}
  </Query>
)

export default GroupsQuery;