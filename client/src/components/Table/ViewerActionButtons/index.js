import * as React from 'react';
import styled from 'styled-components';
import { Button as AntButton } from 'antd';
import { Flex } from 'rebass';
import RaiseSlider from './RaiseSlider';
import MakeActionMutation from './MakeActionMutation';

const Button = styled(AntButton)`
  flex: 1;
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
    const maxRaiseAmount = this.props.currentHand.viewerActions.maxRaiseAmount;
    const isAllIn = this.state.raiseAmount === maxRaiseAmount;

    this.props.makeAction({
      action: isAllIn ? 'allin' : 'raise',
      amount: this.state.raiseAmount,
    });
  }

  render() {
    const { currentHand } = this.props;
    if (!currentHand) return null;
    
    const { isViewerTurn, viewerActions } = currentHand;
    if (!isViewerTurn || !viewerActions) return null;
    
    console.log('ACTIONS', viewerActions)

    const { canFold, canCheck, callAmount, minRaiseAmount, maxRaiseAmount } = viewerActions;
    const { raiseAmount } = this.state;

    // TODO: Implement viewerBetAmount GraphQL field
    // const potAfterCalling = currentHand.mainPot + callAmount
    // const potSizedBet = viewerBetAmount + callAmount + potAfterCalling;

    return (
      <React.Fragment>
        <Flex>
          {canFold && (
            <Button type="primary" onClick={this.handleFold}>
              FOLD
            </Button>
          )}
          {canCheck && (
            <Button type="primary" onClick={this.handleCheck}>
              CHECK
            </Button>
          )}
          {!canCheck && callAmount > 0 && (
            <Button type="primary" onClick={this.handleCall}>
              CALL ${callAmount}
            </Button>
          )}
          {raiseAmount && (
            <Button type="primary" onClick={this.handleRaise}>
              RAISE ${raiseAmount
            }</Button>
          )}
        </Flex>
        <RaiseSlider
          min={minRaiseAmount}
          max={maxRaiseAmount}
          amount={raiseAmount}
          onChange={this.handleRaiseChange}
        />
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