import React from 'react';
import { Box, Text } from 'rebass';

const SearchResult = ({ user, onClick }) => (
  <Box className="ant-dropdown-menu-item" onClick={onClick}>
    <Text fontSize={1} fontWeight="bold">{user.username}</Text>
    <Text>{user.email}</Text>
  </Box>
)

class UserSearchResults extends React.Component {
  render() {
    return (
      <Box 
        className="ant-dropdown-menu"
        style={{ position: 'absolute', width: 'calc(65% - 32px)'}}
      >
        {this.props.users.map(user => (
          <SearchResult key={user.entityId} user={user} onClick={this.props.onSelectUser(user)} />
        ))}
      </Box>
    )
  }
}

export default UserSearchResults;