import React from "react";
import { Box, Flex, Text, Heading, Button } from 'rebass';

class GroupPage extends React.Component {
  render() {
    const { group } = this.props;
    if (!group) return null;

    return (
      <Box p={2}>
        <Heading mb={2}>{group.name}</Heading>
        <Heading mb={2} fontSize={2}>Players</Heading>

        {group.players.map((player, idx) => (
          <Flex key={idx} width="300px" justifyContent="space-between">
            <Text>{player.name}</Text>
            <Text>${player.bankroll}</Text>
            <Text>Joined: {new Date(player.acceptedAt).toLocaleDateString()}</Text>
          </Flex>
        ))}

        <Button mt={2} onClick={this.handleClick} bg="gray">Add player</Button>
      </Box>
    )
  }
}

export default ({ group = null }) => (
  <GroupPage group={group} />
)