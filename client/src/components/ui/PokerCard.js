import * as React from 'react';
import { css } from 'emotion';
import { Box, Card, Text } from 'rebass';

const SUITS = {
  's': '♠',
  'd': '♦',
  'h': '♥',
  'c': '♣',
}
const COLORS = {
  's': 'black',
  'd': 'teal',
  'h': 'red',
  'c': 'green',
}
const cardCss = css`
  width: 48px;
  height: 64px;
  text-align: left;

  :not(:first-child) {
    margin-left: 4px;
  }
`;
const boardMarkerCss = css`
  ${cardCss}
  border: 1px dotted #ccc;
`;

class PokerCard extends React.Component {
  renderContent() {
    if (!this.props.card) return null;

    const [rank, suit] = this.props.card.split('');
    
    return (
      <Box p={1}>
        <Text
          color={COLORS[suit]}
          fontSize={24}
          lineHeight="20px"
        >
          {rank === 'T' ? '10' : rank}
        </Text>
        <Text
          color={COLORS[suit]}
          fontSize={48}
          lineHeight="36px"
          ml={1}
        >
          {SUITS[suit]}
        </Text>
      </Box>
    )
  }

  render() {
    if (this.props.boardMarker) {
      return (
        <Card
          borderRadius={4}
          className={boardMarkerCss}
        />
      )
    }

    return (
      <Card
        bg={this.props.card ? 'white' : '#ddd'}
        borderRadius={4}
        boxShadow='0 2px 8px rgba(0, 0, 0, 0.15)'
        className={cardCss}
      >
        {this.renderContent()}
      </Card>
    )
  }
}

export default PokerCard;