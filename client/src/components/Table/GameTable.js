import React from 'react';
import SixPlayerTable from './SixPlayerTable'

class GameTable extends React.Component {
  render() {
    const { table } = this.props;

    if (table.maxPlayers === 6) {
      return <SixPlayerTable table={table} />
    }

    return null;
  }
}

export default GameTable;