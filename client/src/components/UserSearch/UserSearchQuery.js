import React from 'react';
import { Query } from "react-apollo";
import { Spinner } from "apollo-subscription-example-components";
import gql from "graphql-tag";

const USER_SEARCH_QUERY = gql`
  query UserSearchQuery($query: String) {
    viewer {
      searchUsers(query: $query) {
        username
        email
        entityId
      }
    }
  }
`

const UserSearchQuery = props => {
  if (!props.query) return null;

  return (
    <Query query={USER_SEARCH_QUERY} variables={{ query: props.query }}>
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

export default UserSearchQuery