import React from 'react';
import { css } from 'emotion';
import styled from 'styled-components';
import { Flex, Box } from 'rebass';
import Seat from './Seat';
import EmptySeat from './EmptySeat';
import PokerCard from 'components/ui/PokerCard';
import Chips from 'components/ui/Chips';
import TableBackground from './TableBackground';

class SixPlayerTable extends React.Component {
  state = {
    rotationOffset: 0,
  }

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

  rotate = i => () => {
    let newOffset = this.state.rotationOffset + i;
    if (newOffset === -1) newOffset = 5;
    if (newOffset === 6) newOffset = 0;

    this.setState({ rotationOffset: newOffset })
  }

  rotationOrder = () => {
    const seats = [1, 2, 3, 4, 5, 6]
    const idx = this.state.rotationOffset
    const rotated = [...seats.slice(idx), ...seats.slice(0, idx)]

    return [...rotated.slice(0, 3), ...rotated.slice(3)]
  }

  render() {
    const { currentHand } = this.props.table;

    const mainPotMinusBets = currentHand && currentHand.mainPotMinusBets;
    const mainPot = currentHand && currentHand.mainPot;
    const board = currentHand && currentHand.board;
    const seats = this.rotationOrder()

    return (
      <TableContainer mb={4} justifyContent="space-between">
        <Flex className={css`position: absolute; top: 0; right: 0;`}>
          <span onClick={this.rotate(1)}>{`counter`}</span>|
          <span onClick={this.rotate(-1)}>{`clockwise`}</span>
        </Flex>

        <Flex justifyContent="space-between">
          {seats.map(i => (
            <SeatContainer key={i} p={5}>
              {this.renderSeat(i)}
            </SeatContainer>
          ))}
        </Flex>

        <Table>
          {mainPotMinusBets > 0 && (
            <div className={css`margin: 0 auto;`}>
              <Chips bg="lightgray" />
              Main pot: ${mainPotMinusBets}
            </div>
          )}
  
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

          {mainPot > 0 && (
            <div>Total pot: ${mainPot}</div>
          )}
        </Table>

        <TableBackground />
      </TableContainer>
    )
  }
}

export default SixPlayerTable;

const TableContainer = styled(Flex)`
  height: 60vh;
  position: relative;
  flex-direction: column;
  background-color: #fff;
  padding: 16px;
  border-radius: 2px;
`

const SeatContainer = styled(Box)`
  position: absolute;
  height: 190px;
  width: 190px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .bet {
    position: absolute;
  }

  :first-child {
    left: 0;
    top: 50px;

    .bet {
      left: 150px;
      bottom: -24px;
    }
  }

  :nth-child(2) {
    top: 0;
    left: calc(50% - 90px);
    
    .bet {
      left: 150px;
      bottom: -24px;
    }
  }

  :nth-child(3) {
    left: calc(100% - 190px);
    top: 50px;

    .bet {
      right: 150px;
      bottom: -24px;
    }
  }

  :nth-child(4) {
    left: calc(100% - 190px);    
    top: calc(100% - 240px);

    .bet {
      right: 150px;
      top: -24px;
    }
  }

  :nth-child(5) {
    left: calc(50% - 90px);
    top: calc(100% - 190px);

    .bet {
      right: 150px;
      top: -24px;
    }
  }

  :nth-child(6) {
    left: 0;
    top: calc(100% - 240px);

    .bet {
      left: 150px;
      top: -24px;
    }
  }
`

const Table = styled(Box)`
  width: calc(100% - 32px);
  text-align: center;
  position: absolute;
  top: calc(50% - 55px);
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Board = styled(Flex)`
  margin: 0 auto;
  display: inline-flex;
`
