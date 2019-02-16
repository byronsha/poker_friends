import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const StandFromTableMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation StandFromTable($tableEntityId: String!) {
        standFromTable(tableEntityId: $tableEntityId)
      }
    `}
  >
    {(sitAtTable, { data, loading, error }) =>
      children(sitAtTable, { data, loading, error })
    }
  </Mutation>
)

export default StandFromTableMutation;