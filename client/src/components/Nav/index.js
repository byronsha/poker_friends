import React from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import { Spinner } from "apollo-subscription-example-components";
import gql from "graphql-tag";
import { Box, Flex, Text, Button } from 'rebass';

const NavContainer = ({ children }) => (
  <Box bg="gray" width="250px" p={2} style={{ position: 'absolute', height: '100vh' }}>
    {children}
  </Box>
)
const NavLink = ({ to, children }) => (
  <Link to={to}>
    <Text my={2} color="red" fontSize={1} fontWeight="normal">
      {children}
    </Text>
  </Link>
)
const LogoutContainer = ({ children }) => (
  <Flex mb={2} width="calc(100% - 16px)" alignItems="center" justifyContent="space-between" style={{ position: 'absolute', bottom: 0 }}>
    {children}
  </Flex>
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

class Nav extends React.Component {
  logout = () => {
    console.log('got here')
    localStorage.removeItem('poker_friends')
    // this.props.history.push('/login')
  }

  render() {
    return (
      <NavContainer>
        <NavLink to="/login">
          Login
        </NavLink>
        <NavLink to="/">
          Home
        </NavLink>
        <NavLink to="/pins">
          Pins
        </NavLink>
        <NavLink to="/upload-pin">
          Create pin
        </NavLink>

        <NavLink to="/groups">
          Groups
        </NavLink>
        <NavLink to="/create-group">
          Create group
        </NavLink>
        
        {this.props.viewer && (
          <LogoutContainer>
            <Text color="red" fontSize={1}>
              Logged in as {this.props.viewer.username}
            </Text>
            <Button ml={1} bg="red" onClick={this.logout}>Logout</Button>
          </LogoutContainer>
        )}
      </NavContainer>
    );
  }
}

export default () => (
  <NavQuery>
    {(viewer) => (
      <Nav viewer={viewer} />
    )}
  </NavQuery>
);