import React from 'react';
import { Route } from 'react-router-dom';
import TableQuery from './TableQuery';
import TablePage from './TablePage';

class Table extends React.Component {
  componentDidMount() {
    this.props.subscribeToMoreMessages();
  }

  render() {
    if (!this.props.match) {
      return null;
    }

    return <TablePage table={this.props.table} />
  }
}

export default () => (
  <Route exact path="/groups/:groupEntityId/tables/:tableEntityId">
    {({ match }) => {
      if (!match) return null;

      return (
        <TableQuery>
          {(viewer, subscribeToMoreMessages) => {
            if (!viewer) return null;

            return (
              <Table
                table={viewer.table}
                subscribeToMoreMessages={subscribeToMoreMessages}
                match={match}
              />
            )
          }}
        </TableQuery>
      )
    }}
  </Route>
)