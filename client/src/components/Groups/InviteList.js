import React from "react";
import { Box, Text, Flex } from 'rebass';
import { List, Card } from 'antd';
import AcceptInviteButton from './AcceptInviteButton';
import RejectInviteButton from './RejectInviteButton';

const formatDate = date =>
  date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const FlexOne = ({ children }) => <Text flex={1}>{children}</Text>

class InviteList extends React.Component {
  renderHeader = () => {
    const headers = ['Name', 'Creator', 'Invited', ''];

    return (
      <Flex width="100%" justifyContent="space-between">
        {headers.map((header, idx) =>
          <Text key={idx} flex={1} fontWeight="bold">{header}</Text>
        )}
      </Flex>
    )
  }

  renderInvite = invite => (
    <List.Item>
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <FlexOne>{invite.group.name}</FlexOne>
        <FlexOne>{invite.group.creator.username}</FlexOne>
        <FlexOne>{formatDate(new Date(invite.createdAt))}</FlexOne>
        <Box flex={1} style={{ textAlign: 'right' }}>
          <AcceptInviteButton groupEntityId={invite.group.entityId} />
          <RejectInviteButton groupEntityId={invite.group.entityId} />
        </Box>
      </Flex>
    </List.Item>
  )

  render() {
    const { invites } = this.props;

    return (
      <Card bordered={false} title={<Text fontSize={2}>Invites</Text>}>
        <List
          itemLayout="horizontal"
          dataSource={invites}
          renderItem={this.renderInvite}
          header={this.renderHeader()}
        />
      </Card>
    )
  }
}

export default InviteList