import React from 'react';
import { Route } from "react-router-dom";
import GroupQuery from './GroupQuery';
import GroupPage from './GroupPage';

class Group extends React.Component {
  render() {
    if (!this.props.match) {
      return null;
    }
    return (
      <div>
        <GroupPage group={this.props.group} />
      </div>
    )
  }
}

export default () => (
  <Route exact path="/groups/:groupEntityId">
    {({ match }) => {
      if (!match) return null;
      
      return (
        <GroupQuery>
          {(data) => {
            if (!data || !data.viewer) return null;

            return <Group group={data.viewer.group} match={match} />
          }}
        </GroupQuery>
      )
    }}
  </Route>
)