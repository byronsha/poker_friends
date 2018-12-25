import React from "react";
import { Link, Route } from "react-router-dom";
import { Box, Text, Heading } from 'rebass';

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
      <Box p={2}>
        <Heading mb={2} color="gray">YOUR GROUPS</Heading>
        {this.props.groups.length === 0 && (
          <div>
            <div>You are not a part of any groups yet.</div>
            <Link to="/create-group">Create one</Link>
          </div>
        )}
        <div>
          {this.props.groups.map((group, index) => (
            <div
              key={index}
              ref={element => {
                if (element && index === this.props.groups.length - 1) {
                  this.lastElement = element;
                }
              }}
            >
              <Link to={`/groups/${group.entityId}`}>
                <Text my={1} fontSize={1} color="gray" fontWeight="normal">
                  {group.name}
                </Text>
              </Link>
            </div>
          ))}
        </div>
      </Box>
    )
  }
}

export default ({ groups = [] }) => (
  <Route exact path="/groups">
    {({ match }) => <GroupListPage groups={groups} match={match} />}
  </Route>
);