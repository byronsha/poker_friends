import React from "react";
import {
  Link,
  withRouter
} from "react-router-dom";

class Nav extends React.Component {
  render() {
    return (
      <nav>
        <Link to="/login">
          Login
        </Link>
        <Link to="/">
          Home
        </Link>
        <Link to="/pins">
          Pins
        </Link>
        <Link to="/upload-pin">
          Create pin
        </Link>
      </nav>
    );
  }
}

Nav = withRouter(Nav);

export default Nav;