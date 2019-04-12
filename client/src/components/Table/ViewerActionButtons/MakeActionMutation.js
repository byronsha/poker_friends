import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const MakeActionMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation MakeAction($handEntityId: String!, $action: Action!, $amount: Int) {
        makeAction(handEntityId: $handEntityId, action: $action, amount: $amount)
      }
    `}
  >
    {(makeAction, { data, loading, error }) =>
      children(makeAction, { data, loading, error })
    }
  </Mutation>
)

export default MakeActionMutation;