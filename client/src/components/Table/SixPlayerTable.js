import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'rebass';
import Seat from './Seat';
import EmptySeat from './EmptySeat';

const TableContainer = styled(Flex)`
  height: 60vh;
  position: relative;
  flex-direction: column;
  background-color: #fff;
  padding: 16px;
  border-radius: 2px;
`

const TopSeat = styled(Box)`
  :first-child, :last-child {
    margin-top: 50px;
  }
`
const BottomSeat = styled(Box)`
  :nth-child(2) {
    margin-top: 50px;
  }
`

const Table = styled(Box)`
  width: 100%;
  text-align: center;
`

class SixPlayerTable extends React.Component {
  findSeat = number => {
    return this.props.table.currentSeats.find(seat => seat.number === number)
  }

  viewerIsSeated = () => {
    return !!this.props.table.currentSeats.find(seat => seat.isViewer)
  }

  renderSeat = number => {
    const { entityId, bigBlindAmount } = this.props.table;
    const seat = this.findSeat(number);
    const viewerIsSeated = this.viewerIsSeated();

    if (seat) {
      return (
        <Seat
          seat={seat}
          number={number}
          tableEntityId={entityId}
        />
      )
    }

    return (
      <EmptySeat
        number={number}
        tableEntityId={entityId}
        bigBlindAmount={bigBlindAmount}
        disabled={viewerIsSeated}
      />
    )
  }

  render() {
    console.log('PROPS', this.props)

    return (
      <TableContainer mb={4} justifyContent="space-between">
        <Flex justifyContent="space-between">
          {[1, 2, 3].map(i => (
            <TopSeat key={i} p={6}>
              {this.renderSeat(i)}
            </TopSeat>
          ))}
        </Flex>

        <Table>
          [todo]
        </Table>

        <Flex justifyContent="space-between">
          {[4, 5, 6].map(i => (
            <BottomSeat key={i} p={6}>
              {this.renderSeat(i)}
            </BottomSeat>
          ))}
        </Flex>
      </TableContainer>
    )
  }
}

export default SixPlayerTable;