import * as React from 'react';
import styled from 'styled-components';
import { Button as AntButton } from 'antd';
import { Flex } from 'rebass';
import RaiseSlider from './RaiseSlider';
import MakeActionMutation from './MakeActionMutation';

const Button = styled(AntButton)`
  flex: 1;
`;
const SmallButton = styled(Button)`
  height: 32px;

  :not(:last-child) {
    margin-right: 8px;
  }
`;
const BigButton = styled(Button)`
  font-weight: bold;
  height: 48px;

  :not(:last-child) {
    margin-right: 16px;
  }
`;

class ViewerActionButtons extends React.Component {
  constructor(props) {
    super(props)

    const { currentHand } = this.props;
    if (!currentHand) return;

    const { isViewerTurn, viewerActions } = currentHand;
    if (!isViewerTurn || !viewerActions) return;

    this.state = {
      raiseAmount: viewerActions.minRaiseAmount,
    }
  }

  handleRaiseChange = raiseAmount => {
    this.setState({ raiseAmount })
  }

  handleFold = () => {
    this.props.makeAction({
      action: 'fold',
      amount: null,
    });
  }

  handleCheck = () => {
    this.props.makeAction({
      action: 'check',
      amount: null,
    });
  }

  handleCall = () => {
    const callAmount = this.props.currentHand.viewerActions.callAmount;
    if (!callAmount) return;

    this.props.makeAction({
      action: 'call',
      amount: callAmount,
    });
  }

  handleRaise = () => {
    this.props.makeAction({
      action: 'raise',
      amount: this.state.raiseAmount,
    });
  }

  renderPotSizes = (viewerActions, currentHand) => {
    const { callAmount, minRaiseAmount, maxRaiseAmount } = viewerActions;
    const { bets, mainPot, viewerSeat } = currentHand;

    const viewerBet = bets[`seat${viewerSeat}Bet`];
    const potSizedBet = callAmount + viewerBet + mainPot;

    return (
      <Flex>
        <SmallButton
          type="normal"
          onClick={() => this.setState({ raiseAmount: minRaiseAmount })}
        >
          Min
        </SmallButton>
        <SmallButton
          type="normal"
          onClick={() => this.setState({ raiseAmount: Math.round(potSizedBet/4) })}
        >
          1/4 Pot
        </SmallButton>
        <SmallButton
          type="normal"
          onClick={() => this.setState({ raiseAmount: Math.round(potSizedBet/2) })}
        >
          1/2 Pot
        </SmallButton>
        <SmallButton
          type="normal"
          onClick={() => this.setState({ raiseAmount: potSizedBet })}
        >
          Pot (${potSizedBet})
        </SmallButton>
        <SmallButton
          type="normal"
          onClick={() => this.setState({ raiseAmount: maxRaiseAmount })}
        >
          All in
        </SmallButton>
      </Flex>
    )
  }

  render() {
    const { currentHand } = this.props;
    if (!currentHand) return null;
    
    const { isViewerTurn, viewerActions } = currentHand;
    if (!isViewerTurn || !viewerActions) return null;
    
    console.log('ACTIONS', viewerActions)
    console.log('HAND', currentHand)

    const { canFold, canCheck, callAmount, minRaiseAmount, maxRaiseAmount } = viewerActions;
    const { raiseAmount } = this.state;

    const canRaise = (minRaiseAmount != null && maxRaiseAmount != null);

    return (
      <React.Fragment>
        {canRaise && this.renderPotSizes(viewerActions, currentHand)}
        {canRaise && (
          <RaiseSlider
            min={minRaiseAmount}
            max={maxRaiseAmount}
            amount={raiseAmount}
            onChange={this.handleRaiseChange}
          />
        )}
        <Flex mt={3}>
          {canFold && (
            <BigButton type="primary" onClick={this.handleFold}>
              FOLD
            </BigButton>
          )}
          {canCheck && (
            <BigButton type="primary" onClick={this.handleCheck}>
              CHECK
            </BigButton>
          )}
          {!canCheck && callAmount > 0 && (
            <BigButton type="primary" onClick={this.handleCall}>
              CALL ${callAmount}
            </BigButton>
          )}
          {raiseAmount && (
            <BigButton type="primary" onClick={this.handleRaise}>
              RAISE ${raiseAmount
            }</BigButton>
          )}
        </Flex>
      </React.Fragment>
    ) 
  }
}

export default ({ currentHand }) => {
  if (!currentHand || !currentHand.viewerActions) return null;
  return (
    <MakeActionMutation>
      {(makeAction, { data, loading, error }) => (
        <ViewerActionButtons
          makeAction={({ action, amount }) =>
            makeAction({ variables: {
              handEntityId: currentHand.entityId,
              action,
              amount,
            }})
          }
          currentHand={currentHand}
        />     
      )}
    </MakeActionMutation>
  )
}