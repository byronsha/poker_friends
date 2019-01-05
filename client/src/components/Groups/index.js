import React from 'react';
import GroupListPage from './GroupListPage'
import AddGroupPage from './AddGroupPage'
import GroupsQuery from './GroupsQuery'
import AddGroupMutation from './AddGroupMutation'

class Groups extends React.Component {
  render() {
    const { groups, groupInvites } = this.props;
    
    return (
      <div>
        <GroupListPage groups={groups} groupInvites={groupInvites} />
        <AddGroupMutation>
          {(addGroup, { data, loading, error }) => (
            <AddGroupPage
              addGroup={({ name }) =>
                addGroup({ variables: { name } })
              }
            />
          )}
        </AddGroupMutation>
      </div>
    )
  }
}

export default () => (
  <GroupsQuery>
    {(data) => {
      if (!data || !data.viewer) return null;
      
      return <Groups groups={data.viewer.groups} groupInvites={data.viewer.groupInvites} />
    }}
  </GroupsQuery>
)