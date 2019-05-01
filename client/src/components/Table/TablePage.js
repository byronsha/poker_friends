import React from 'react';
import { css } from 'emotion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PageContainer from '../PageContainer';
import { Flex, Box, Text } from 'rebass';
import { Breadcrumb } from 'antd';
import AddMessageInput from './AddMessageInput';
import GameTable from './GameTable';
import ViewerActionButtons from './ViewerActionButtons';

const breadcrumb = css`
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 280px;
  z-index: 0;
`;

const Container = styled(Box)`
  background-color: #fff;
  padding: 16px;
  border-radius: 2px;
  height: calc(24vh + 6px);
  flex: 1;

  :first-child {
    margin-right: 24px;
  }
`;

const dateOptions = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric',
};

class TablePage extends React.Component {
  componentDidMount() {
    if (this.lastElement) {
      this.lastElement.scrollIntoView();
    }
  }

  componentDidUpdate() {
    this.lastElement.scrollIntoView({ behavior: "smooth" });    
  }

  formatDate = createdAt =>
    new Date(parseInt(createdAt)).toLocaleDateString('en-US', dateOptions);

  render() {
    const { table } = this.props;
    if (!table) return null;

    return (
      <div>
        <Breadcrumb className={breadcrumb}>
          <Breadcrumb.Item>
            <Link to="/groups" style={{ fontWeight: 'normal' }}>
              Groups
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/groups/${table.group.entityId}`} style={{ fontWeight: 'normal' }}>
              {table.group.name}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{table.name}</Breadcrumb.Item>
        </Breadcrumb>

        <PageContainer>
          <GameTable table={table} />

          <Flex>
            <Container>
              <ViewerActionButtons currentHand={table.currentHand} />
            </Container>

            <Container>
              <Box px={2} mb={3} style={{
                overflow: 'auto',
                height: 'calc(16vh + 16px)',
                maxHeight: 'calc(16vh + 16px)',
                boxShadow: '#eee 1px 1px 4px inset',
              }}>
                {table.messages.map((message, idx) => (
                  <Box
                    mb={1}
                    key={idx}
                    ref={element => {
                      if (element && idx === table.messages.length - 1) {
                        this.lastElement = element;
                      }
                    }}
                  >
                    <Flex alignItems="center">
                      <Text fontSize={1} fontWeight="bold" mr={1}>
                        {message.author.username}
                      </Text>
                      <Text mt={1} color="lightgray" style={{ fontSize: '12px' }}>
                        {this.formatDate(message.createdAt)}
                      </Text>  
                    </Flex>
                    <Text fontSize={1}>{message.body}</Text>
                  </Box>
                ))}
              </Box>

              <AddMessageInput tableEntityId={table.entityId} />
            </Container>
          </Flex>
        </PageContainer>
      </div>
    )
  }
}

export default ({ table = null }) => (
  <TablePage table={table} />
)