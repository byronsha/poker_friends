import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const RejectInviteMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation RejectGroupInvite($groupEntityId: String!) {
        rejectGroupInvite(groupEntityId: $groupEntityId)
      }
    `}
    refetchQueries={['GroupsQuery']}
  >
    {(rejectGroupInvite, { data, loading, error }) =>
      children(rejectGroupInvite, { data, loading, error })
    }
  </Mutation>
)

export default RejectInviteMutation;