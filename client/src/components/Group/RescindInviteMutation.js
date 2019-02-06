import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const RescindInviteMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation RescindGroupInvite($userEntityId: String!, $groupEntityId: String!) {
        rescindGroupInvite(userEntityId: $userEntityId, groupEntityId: $groupEntityId)
      }
    `}
    refetchQueries={['GroupQuery']}
  >
    {(rescindGroupInvite, { data, loading, error }) =>
      children(rescindGroupInvite, { data, loading, error })
    }
  </Mutation>
)

export default RescindInviteMutation;