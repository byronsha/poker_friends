import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const SitAtTableMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation SitAtTable($tableEntityId: String!, $seat: Int!) {
        sitAtTable(tableEntityId: $tableEntityId, seat: $seat)
      }
    `}
  >
    {(sitAtTable, { data, loading, error }) =>
      children(sitAtTable, { data, loading, error })
    }
  </Mutation>
)

export default SitAtTableMutation;