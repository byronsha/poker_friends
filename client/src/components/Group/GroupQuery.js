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
        players {
          name
          bankroll
          acceptedAt
        }
      }
    }
  }
`;

const GroupQuery = props => {
  const groupEntityId = props.match.params.groupEntityId;
  
  return (
    <Query query={GROUP_QUERY} variables={{ groupEntityId }}>
      {({ loading, error, data }) => {
        if (loading) {
          return (
            <div style={{ paddingTop: 20 }}>
              <Spinner show />
            </div>
          );
        }
        if (error) return <p>Error :(</p>;

        return props.children(data);
      }}
    </Query>
  )
}

export default withRouter(GroupQuery);