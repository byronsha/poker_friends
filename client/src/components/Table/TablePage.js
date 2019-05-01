import React from 'react';
import { css } from 'emotion';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PageContainer from '../PageContainer';
import { Flex, Box } from 'rebass';
import { Breadcrumb } from 'antd';
import MessageList from './MessageList';
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

class TablePage extends React.Component {
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
              <MessageList messages={table.messages} />
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