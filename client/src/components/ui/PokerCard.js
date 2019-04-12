import * as React from 'react';
import { css } from 'emotion';
import { Card, Text } from 'rebass';

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
      <Text
        color={COLORS[suit]}
        fontSize={24}
      >
        {rank === 'T' ? '10' : rank}{SUITS[suit]}
      </Text>
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