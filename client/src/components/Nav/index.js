import React from "react";
import { Link } from "react-router-dom";
import { Query } from "react-apollo";
import { Spinner } from "apollo-subscription-example-components";
import gql from "graphql-tag";
import { Box } from 'rebass';

const NavLink = ({ to, children }) => (
  <Box p={1}>
    <Link to={to}>{children}</Link>
  </Box>
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
      <nav>
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
          <React.Fragment>
            <span>logged in as {this.props.viewer.username}</span>
            <button onClick={this.logout}>Logout</button>
          </React.Fragment>
        )}
      </nav>
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