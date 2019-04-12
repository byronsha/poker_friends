import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'rebass';
import Seat from './Seat';
import EmptySeat from './EmptySeat';
import PokerCard from 'components/ui/PokerCard';

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

const Board = styled(Flex)`
  margin: 0 auto;
  display: inline-flex;
`

class SixPlayerTable extends React.Component {
  findSeat = number => {
    return this.props.table.currentSeats.find(seat => seat.number === number)
  }

  viewerIsSeated = () => {
    return !!this.props.table.currentSeats.find(seat => seat.isViewer)
  }

  renderSeat = number => {
    const { entityId, bigBlindAmount, currentHand } = this.props.table;
    const seat = this.findSeat(number);
    const viewerIsSeated = this.viewerIsSeated();

    if (seat) {
      return (
        <Seat
          seat={seat}
          number={number}
          currentHand={currentHand}
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
    console.log('CURRENT HAND', this.props.table.currentHand)

    const { currentHand } = this.props.table;

    const mainPot = currentHand && currentHand.mainPot;
    const board = currentHand && currentHand.board;

    return (
      <TableContainer mb={4} justifyContent="space-between">
        <Flex justifyContent="space-between">
          {[1, 2, 3].map(i => (
            <TopSeat key={i} p={5}>
              {this.renderSeat(i)}
            </TopSeat>
          ))}
        </Flex>

        <Table>
          {Boolean(board && board.length) && (
            <Board>
              {[...Array(5).keys()].map(i =>
                board[i] ? (
                  <PokerCard card={board[i]} key={i} />
                ) : (
                  <PokerCard boardMarker key={i} />
                )
              )}
            </Board>
          )}

          <div>
            Pot: ${mainPot}
          </div>
        </Table>

        <Flex justifyContent="space-between">
          {[4, 5, 6].map(i => (
            <BottomSeat key={i} p={5}>
              {this.renderSeat(i)}
            </BottomSeat>
          ))}
        </Flex>
      </TableContainer>
    )
  }
}

export default SixPlayerTable;