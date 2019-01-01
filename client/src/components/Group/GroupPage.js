import React from "react";
import { Box, Flex, Text, Heading } from 'rebass';
import AddPlayerModal from './AddPlayerModal';

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

        <AddPlayerModal />
      </Box>
    )
  }
}

export default ({ group = null }) => (
  <GroupPage group={group} />
)