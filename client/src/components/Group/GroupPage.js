import React from "react";
import { Box, Flex, Text } from 'rebass';
import { List } from 'antd';
import AddPlayerModal from './AddPlayerModal';

class GroupPage extends React.Component {
  renderPlayer = player => {
    return (
      <List.Item>
        <Flex width="100%" justifyContent="space-between">
          <Text flex={1}>{player.name}</Text>
          <Text flex={1}>${player.bankroll}</Text>
          <Text flex={1}>
            {player.acceptedAt ? `Joined: ${new Date(player.acceptedAt).toLocaleDateString()}` : 'Invite sent'}
          </Text>
        </Flex>
      </List.Item>
    )
  }

  render() {
    const { group } = this.props;
    if (!group) return null;

    return (
      <Box>
        <h1>Groups / {group.name}</h1>
        <h2>Players</h2>
        <List
          itemLayout="horizontal"
          dataSource={group.players}
          renderItem={this.renderPlayer}
        />
        <AddPlayerModal groupEntityId={group.entityId} />
      </Box>
    )
  }
}

export default ({ group = null }) => (
  <GroupPage group={group} />
)