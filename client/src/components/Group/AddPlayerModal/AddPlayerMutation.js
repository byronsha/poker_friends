import React from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const AddPlayerMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation AddPlayer($groupEntityId: String!, $userEntityId: String!, $bankroll: Int) {
        addPlayer(groupEntityId: $groupEntityId, userEntityId: $userEntityId, bankroll: $bankroll) {
          name
          bankroll
          acceptedAt
        }
      }
    `}
  >
    {(addPlayer, { data, loading, error }) =>
      children(addPlayer, { data, loading, error })
    }
  </Mutation>
)

export default AddPlayerMutation;