import React from 'react';
import UserSearchQuery from './UserSearchQuery';
import UserSearchResults from './UserSearchResults';
import { Box } from 'rebass';
import { Input, InputNumber, Icon } from 'antd';

class UserSearch extends React.Component {
  state = {
    value: '',
    searchValue: '',
    user: null,
  }

  timeout = null

  handleChange = e => {
    e.preventDefault();
    const value = e.target.value;
    
    this.setState({ value, user: null })
    this.props.onUserSelect(null)

    const setSearch = () => {
      this.setState({ searchValue: value })
    }
    
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    this.timeout = setTimeout(setSearch, 500);
  }

  handleUserSelect = user => () => {
    this.setState({ user, value: user.email })
    this.props.onUserSelect(user)
  }
  
  render() {
    return (
      <Box>
        <Input
          type="text"
          value={this.state.value}
          onChange={this.handleChange}
          placeholder="Enter email"
          style={{ width: '65%' }}
          suffix={this.state.user ? (
            <Icon type="check" />
          ) : null}
        />

        <InputNumber
          defaultValue={100}
          onChange={this.props.onBankrollChange}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          style={{ marginLeft: '24px', width: 'calc(35% - 24px)' }}
        />

        {!this.state.user && (
          <UserSearchQuery query={this.state.searchValue}>
            {(data) => {
              if (!data.viewer || !data.viewer.searchUsers) return null;
              return (
                <UserSearchResults
                  users={data.viewer.searchUsers}
                  onSelectUser={this.handleUserSelect}
                />
              )
            }}
          </UserSearchQuery>
        )}
      </Box>
    )
  }
}

export default UserSearch;