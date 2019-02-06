import React from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const AcceptInviteMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation AcceptInvite($groupEntityId: String!) {
        acceptGroupInvite(groupEntityId: $groupEntityId) {
          name
          viewerJoinedAt
        }
      }
    `}
    refetchQueries={['GroupsQuery']}
  >
    {(acceptGroupInvite, { data, loading, error }) =>
      children(acceptGroupInvite, { data, loading, error })
    }
  </Mutation>
)

export default AcceptInviteMutation;