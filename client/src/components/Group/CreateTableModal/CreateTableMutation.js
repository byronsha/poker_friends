import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const CreateTableMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation CreateTable(
        $groupEntityId: String!
        $name: String!
        $smallBlindAmount: Int!
        $bigBlindAmount: Int!
        $maxPlayers: Int!
      ) {
        createTable(
          groupEntityId: $groupEntityId
          name: $name
          smallBlindAmount: $smallBlindAmount
          bigBlindAmount: $bigBlindAmount
          maxPlayers: $maxPlayers
        ) {
          name
          entityId
        }
      }
    `}
    refetchQueries={['GroupQuery']}
  >
    {(createTable, { data, loading, error }) =>
      children(createTable, { data, loading, error })
    }
  </Mutation>
)

export default CreateTableMutation;