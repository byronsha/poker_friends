import React from "react";
import { Link } from "react-router-dom";
import { css } from 'emotion';
import { Box, Flex, Text } from 'rebass';
import { Card, List, Breadcrumb } from 'antd';
import PageContainer from '../PageContainer';
import AddPlayerModal from './AddPlayerModal';
import RescindInviteButton from './RescindInviteButton';
import PlayerBankroll from './PlayerBankroll';

const breadcrumb = css`
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 280px;
  z-index: 0;
`;

class GroupPage extends React.Component {
  renderHeader = () => {
    const headers = ['Name', 'Bankroll', 'Status', ''];

    return (
      <Flex width="100%" justifyContent="space-between">
        {headers.map((header, idx) =>
          <Text key={idx} flex={1} fontWeight="bold">{header}</Text>  
        )}
      </Flex>
    )
  }

  renderPlayer = player => {
    return (
      <List.Item>
        <Flex width="100%" justifyContent="space-between">
          <Text flex={1}>{player.name}</Text>
          <Box flex={1}>
            <PlayerBankroll
              userEntityId={player.user.entityId}
              groupEntityId={this.props.group.entityId}
              currentBankroll={player.bankroll}
            />
          </Box>
          <Text flex={1}>
            {player.acceptedAt ? `Joined: ${new Date(player.acceptedAt).toLocaleDateString()}` : 'Invite sent'}
          </Text>
          <Box flex={1} style={{ textAlign: 'right' }}>
            {!player.acceptedAt && (
              <RescindInviteButton
                userEntityId={player.user.entityId}
                groupEntityId={this.props.group.entityId}
              />
            )}
          </Box>
        </Flex>
      </List.Item>
    )
  }

  render() {
    const { group } = this.props;
    if (!group) return null;

    const title = (
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize={2}>Players</Text>
        <AddPlayerModal groupEntityId={group.entityId} />
      </Flex> 
    )

    return (
      <div>
        <Breadcrumb className={breadcrumb}>
          <Breadcrumb.Item>
            <Link to="/groups" style={{ fontWeight: 'normal' }}>
              Groups
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{group.name}</Breadcrumb.Item>
        </Breadcrumb>

        <PageContainer>
          <Card bordered={false} title={title}>
            <List
              itemLayout="horizontal"
              dataSource={group.players}
              renderItem={this.renderPlayer}
              header={this.renderHeader()}
            />
          </Card>
        </PageContainer>
      </div>
    )
  }
}

export default ({ group = null }) => (
  <GroupPage group={group} />
)