import React from 'react';
import { Box, Text } from 'rebass';
import SitAtTableMutation from '../mutations/SitAtTableMutation';

class EmptySeat extends React.Component {
  handleClick = e => {
    e.preventDefault();
    this.props.sitAtTable()
  }

  render() {
    return (
      <Box onClick={this.handleClick}>
        <Text>{this.props.number}</Text>
        <Text>Sit here</Text>
      </Box>
    )
  }
}

export default ({ tableEntityId, number }) => (
  <SitAtTableMutation>
    {(sitAtTable, { data, loading, error }) => (
      <EmptySeat
        number={number}
        sitAtTable={() =>
          sitAtTable({
            variables: {
              tableEntityId,
              seat: number,
            },
          })
        }
      />
    )}
  </SitAtTableMutation>
)