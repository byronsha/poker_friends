import React from 'react';
import styled from 'styled-components';
import { Flex, Box } from 'rebass';
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
  render() {
    const tableEntityId: number = this.props.table.entityId;

    return (
      <TableContainer mb={4} justifyContent="space-between">
        <Flex justifyContent="space-between">
          {[1, 2, 3].map(i => (
            <TopSeat key={i} p={6}>
              <EmptySeat tableEntityId={tableEntityId} number={i} />
            </TopSeat>
          ))}
        </Flex>
        <Table>
          [todo]
        </Table>
        <Flex justifyContent="space-between">
          {[4, 5, 6].map(i => <BottomSeat key={i} p={6}>Seat {i}</BottomSeat>)}
        </Flex>
      </TableContainer>
    )
  }
}

export default SixPlayerTable;