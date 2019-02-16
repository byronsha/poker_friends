import React from 'react';
import { Route } from "react-router-dom";
import GroupQuery from './GroupQuery';
import GroupPage from './GroupPage';

class Group extends React.Component {
  componentDidMount() {
    this.props.subscribeToMorePlayers();
  }

  render() {
    if (!this.props.match) {
      return null;
    }
   
    return <GroupPage group={this.props.group} />
  }
}

export default () => (
  <Route exact path="/groups/:groupEntityId">
    {({ match }) => {
      if (!match) return null;
      
      return (
        <GroupQuery>
          {(data, subscribeToMorePlayers) => {
            if (!data || !data.viewer) return null;

            return (
              <Group
                group={data.viewer.group}
                subscribeToMorePlayers={subscribeToMorePlayers}
                match={match}
              />
            )
          }}
        </GroupQuery>
      )
    }}
  </Route>
)