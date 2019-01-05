import React from "react";
import { Link, Route } from "react-router-dom";
import { Box, Text, Flex } from 'rebass';
import { List } from 'antd';

const formatDate = date =>
  date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',  
  });

class GroupListPage extends React.Component {
  componentDidUpdate({ groups }) {
    if (
      this.props.groups.length !== groups &&
      this.lastElement &&
      groups.length !== 0 // Only scroll on updates. Don't scroll in the first request
    ) {
      this.lastElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  renderGroupsHeader = () => (
    <Flex width="100%" justifyContent="space-between">
      <Text flex={1} fontWeight="bold">Name</Text>
      <Text flex={1} fontWeight="bold">Creator</Text>
      <Text flex={1} fontWeight="bold">Joined</Text>
    </Flex>
  )

  renderGroup = group => (
    <List.Item>
      <Flex width="100%" justifyContent="space-between">
        <Box flex={1}>
          <Link to={`/groups/${group.entityId}`}>
            <Text my={1} fontWeight="normal">
              {group.name}
            </Text>
          </Link>
        </Box>
        <Text flex={1}>{group.creator.username}</Text>
        <Text flex={1}>
          {formatDate(new Date(group.viewerJoinedAt))}
        </Text>
      </Flex>
    </List.Item>
  )

  renderInvitesHeader = () => (
    <Flex width="100%" justifyContent="space-between">
      <Text flex={1} fontWeight="bold">Name</Text>
      <Text flex={1} fontWeight="bold">Creator</Text>
      <Text flex={1} fontWeight="bold">Invited</Text>
    </Flex>
  )

  renderInvite = invite => (
    <List.Item>
      <Flex width="100%" justifyContent="space-between">
        <Text flex={1}>{invite.group.name}</Text>
        <Text flex={1}>{invite.group.creator.username}</Text>
        <Text flex={1}>{formatDate(new Date(invite.createdAt))}</Text>
      </Flex>
    </List.Item>
  )

  render() {
    const { groups, groupInvites, match } = this.props;

    if (!match) {
      return null;
    }

    return (
      <Box>
        <h1>Groups</h1>
        <h2>Your groups</h2>
        {groups.length === 0 && (
          <div>You are not a part of any groups yet.</div>
        )}
        <Box mb={3}>
          <List
            itemLayout="horizontal"
            dataSource={groups}
            renderItem={this.renderGroup}
            header={this.renderGroupsHeader()}
          />
        </Box>

        <h2>Invites</h2>
        {groupInvites.length === 0 && (
          <div>You currenly have no pending invites.</div>
        )}
        <List
          itemLayout="horizontal"
          dataSource={groupInvites}
          renderItem={this.renderInvite}
          header={this.renderInvitesHeader()}
        />
      </Box>
    )
  }
}

export default ({ groups = [], groupInvites = [] }) => (
  <Route exact path="/groups">
    {({ match }) => (
      <GroupListPage
        groups={groups}
        groupInvites={groupInvites}
        match={match}
      />
    )}
  </Route>
);