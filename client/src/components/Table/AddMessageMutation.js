import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const AddMessageMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation AddMessage($body: String!, $tableEntityId: String!) {
        addMessage(body: $body, tableEntityId: $tableEntityId) {
          body
          createdAt
          author {
            username
          }
        }
      }
    `}
  >
    {(addMessage, { data, loading, error }) =>
      children(addMessage, { data, loading, error })
    }
  </Mutation>
)

export default AddMessageMutation;