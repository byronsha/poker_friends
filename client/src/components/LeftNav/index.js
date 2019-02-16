import React from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import { Spinner } from "apollo-subscription-example-components";
import gql from "graphql-tag";
import { Box, Flex, Text } from 'rebass';
import { Menu, Button } from 'antd';

const NavLink = ({ to, children }) => (
  <Link to={to}>
    <Text fontWeight="normal">
      {children}
    </Text>
  </Link>
)

const NAV_QUERY = gql`{
  viewer {
    email
    username
  }
}`

const NavQuery = ({ children }) => (
  <Query query={NAV_QUERY}>
    {({ loading, error, data }) => {
      if (loading)
        return (
          <div style={{ paddingTop: 20 }}>
            <Spinner show />
          </div>
        );
      if (error) return <p>Error :(</p>;

      return children(data.viewer);
    }}
  </Query>
)

class LeftNav extends React.Component {
  logout = () => {
    console.log('got here')
    localStorage.removeItem('poker_friends')
    // this.props.history.push('/login')
  }

  render() {
    return (
      <Menu
        mode="inline"
        style={{
          width: '256px',
          position: 'absolute',
          height: '100vh',
          boxShadow: '2px 0 6px rgba(0, 21, 41, .08)',
          zIndex: 2,
        }}
      >
        <Box px={4} py={5} style={{ height: '64px' }}>
          <h2>POKER FRIENDS</h2>
        </Box>

        <Menu.Item key="1">
          <NavLink to="/login">Login</NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to="/">Home</NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to="/pins">Pins</NavLink>
        </Menu.Item>
        <Menu.Item key="4">
          <NavLink to="/upload-pin">Create pin</NavLink>
        </Menu.Item>
        <Menu.Item key="5">
          <NavLink to="/groups">Groups</NavLink>
        </Menu.Item>

        {this.props.viewer && (
          <Menu.Item style={{ position: 'absolute', bottom: 0 }}>
            <Flex alignItems="center" justifyContent="space-between">
              <Text>
                Logged in as {this.props.viewer.username}
              </Text>
              <Button onClick={this.logout}>Logout</Button>
            </Flex>
          </Menu.Item>
        )}
      </Menu>
    );
  }
}

export default () => (
  <NavQuery>
    {(viewer) => (
      <LeftNav viewer={viewer} />
    )}
  </NavQuery>
);