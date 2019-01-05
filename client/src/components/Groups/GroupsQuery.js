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
        creator {
          username
        }
        viewerJoinedAt
      }
      groupInvites {
        group {
          name
          creator {
            username
          }
        }
        createdAt
      }
    }
  }
`;

const GroupsQuery = ({ children }) => (
  <Query query={GROUPS_QUERY}>
    {({ loading, error, data }) => {
      if (loading) {
        return (
          <div style={{ paddingTop: 20 }}>
            <Spinner show />
          </div>
        );
      }
      if (error) return <p>Error :(</p>;

      return children(data);
    }}
  </Query>
)

export default GroupsQuery;