import React from 'react';
import GroupListPage from './GroupListPage'
import GroupsQuery from './GroupsQuery'

class Groups extends React.Component {
  render() {
    return (
      <GroupListPage
        groups={this.props.groups}
        groupInvites={this.props.groupInvites}
      />
    );
  }
}

export default () => (
  <GroupsQuery>
    {(data) => {
      if (!data || !data.viewer) return null;
      
      return (
        <Groups
          groups={data.viewer.groups}
          groupInvites={data.viewer.groupInvites}
        />
      )
    }}
  </GroupsQuery>
)