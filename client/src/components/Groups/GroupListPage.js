import React from "react";
import { css } from 'emotion';
import { Link, Route } from "react-router-dom";
import { Box, Text, Flex } from 'rebass';
import { Card, List, Button, Breadcrumb } from 'antd';
import InviteList from './InviteList';
import PageContainer from "../PageContainer";

const breadcrumb = css`
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 280px;
  z-index: 0;
`;

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

  renderHeader = () => (
    <Flex width="100%" justifyContent="space-between">
      <Text flex={1} fontWeight="bold">Name</Text>
      <Text flex={1} fontWeight="bold">Creator</Text>
      <Text flex={1} fontWeight="bold">Joined</Text>
      <Box flex={1} />
    </Flex>
  )

  renderGroup = group => (
    <List.Item>
      <Flex width="100%" justifyContent="space-between" alignItems="center">
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
        <Box flex={1} />
      </Flex>
    </List.Item>
  )

  render() {
    const { groups, groupInvites, match } = this.props;

    if (!match) {
      return null;
    }

    const title = (
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize={2}>Groups</Text>
        <Button type="primary">Create group</Button>
      </Flex>
    )

    return (
      <div>
        <Breadcrumb className={breadcrumb}>
          <Breadcrumb.Item>Groups</Breadcrumb.Item>
        </Breadcrumb>

        <PageContainer>
          <Card bordered={false} title={title} style={{ marginBottom: '24px' }}>
            <List
              itemLayout="horizontal"
              dataSource={groups}
              renderItem={this.renderGroup}
              header={this.renderHeader()}
            />
          </Card>

          <InviteList invites={groupInvites} />
        </PageContainer>
      </div>
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