import React from 'react';
import GroupListPage from './GroupListPage'
import AddGroupPage from './AddGroupPage'
import GroupsQuery from './GroupsQuery'
import AddGroupMutation from './AddGroupMutation'

class Groups extends React.Component {
  componentDidMount() {
    this.props.subscribeToMoreGroups();
  }

  render() {
    return (
      <div>
        <GroupListPage groups={this.props.groups} />
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
    {(data, subscribeToMoreGroups) => {
      if (!data || !data.viewer) return null;
      
      return <Groups groups={data.viewer.groups} subscribeToMoreGroups={subscribeToMoreGroups} />
    }}
  </GroupsQuery>
)