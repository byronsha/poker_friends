import React from "react";
import { Link, Route } from "react-router-dom";

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

  render() {
    if (!this.props.match) {
      return null;
    }
    return (
      <div>
        {this.props.groups.length === 0 && (
          <div>
            <div>You are not a part of any groups yet.</div>
            <Link to="/create-group">Create one</Link>
          </div>
        )}
        <ul>
          {this.props.groups.map((group, index) => (
            <li
              key={index}
              ref={element => {
                if (element && index === this.props.groups.length - 1) {
                  this.lastElement = element;
                }
              }}
            >
              {group.name}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default ({ groups = [] }) => (
  <Route exact path="/groups">
    {({ match }) => <GroupListPage groups={groups} match={match} />}
  </Route>
);