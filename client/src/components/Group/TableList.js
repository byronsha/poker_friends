import React from "react";
import { Link } from 'react-router-dom';
import { Box, Text, Flex } from 'rebass';
import { List, Card } from 'antd';
import CreateTableModal from './CreateTableModal';

class TableList extends React.Component {
  renderHeader = () => {
    const headers = ['Name', 'Stakes', 'Max players']

    return (
      <Flex width="100%" justifyContent="space-between">
        {headers.map((header, idx) =>
          <Text key={idx} flex={1} fontWeight="bold">{header}</Text>
        )}
      </Flex>
    )
  }

  renderTable = table => {
    return (
      <List.Item>
        <Flex width="100%" justifyContent="space-between">
          <Box flex={1}>
            <Link to={`/groups/${this.props.groupEntityId}/tables/${table.entityId}`}>
              <Text fontWeight="normal">{table.name}</Text>
            </Link>
          </Box>
          <Text flex={1}>${table.smallBlindAmount}/{table.bigBlindAmount}</Text>
          <Text flex={1}>{table.maxPlayers}</Text>
        </Flex>
      </List.Item>
    )
  }

  render() {
    const cardHeader = (
      <Flex justifyContent="space-between" alignItems="center">
        <Text fontSize={2}>Tables</Text>
        <CreateTableModal groupEntityId={this.props.groupEntityId} />
      </Flex>
    )

    return (
      <Card bordered={false} title={cardHeader}>
        <List
          itemLayout="horizontal"
          dataSource={this.props.tables}
          renderItem={this.renderTable}
          header={this.renderHeader()}
        />
      </Card>
    )
  }
}

export default TableList