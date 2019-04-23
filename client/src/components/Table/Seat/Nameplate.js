import * as React from 'react';
import styled from 'styled-components';
import { Text, Card } from 'rebass';
import theme from 'theme';

const colors = theme.colors;

const Nameplate = styled(Card)`
  width: 120px;
  text-align: right;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  ${p => (p.active ? `border: 1px solid ${colors.teal};` : '')}
`;

const StackAmount = styled(Text)`
  border-bottom: 1px solid ${colors.lightergray};
`;

export default ({ isTurn, number, user, isButton, stackAmount }) => (
  <Nameplate active={isTurn} borderRadius={4} bg={colors.lightestgray}>
    <StackAmount fontSize={1} py={1} px={2}>
      $ {stackAmount}
    </StackAmount>
    <Text py={1} px={2}>
      {number} {user.username} {isButton ? '(D)' : ''}
    </Text>
  </Nameplate>
)
