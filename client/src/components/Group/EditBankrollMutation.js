import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const EditBankrollMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation EditBankroll($userEntityId: String!, $groupEntityId: String!, $bankroll: Int!) {
        editBankroll(userEntityId: $userEntityId, groupEntityId: $groupEntityId, bankroll: $bankroll) {
          userEntityId
        }
      }
    `}
    refetchQueries={['GroupQuery']}
  >
    {(editBankroll, { data, loading, error }) =>
      children(editBankroll, { data, loading, error })
    }
  </Mutation>
)

export default EditBankrollMutation;