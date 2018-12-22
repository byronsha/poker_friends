import React from 'react';
import { Mutation } from "react-apollo";
import gql from "graphql-tag";

const AddGroupMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation AddGroup($name: String!) {
        addGroup(name: $name) {
          name
        }
      }
    `}
  >
    {(addGroup, { data, loading, error }) =>
      children(addGroup, { data, loading, error })
    }
  </Mutation>
)

export default AddGroupMutation;