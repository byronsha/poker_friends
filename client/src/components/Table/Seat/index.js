import React from 'react';
import { css } from 'emotion';
import { Box, Flex } from 'rebass';
import { Menu, Dropdown, Icon, Modal } from 'antd';
import PokerCard from 'components/ui/PokerCard';
import Chips from 'components/ui/Chips';
import Nameplate from './Nameplate';

import StandFromTableMutation from '../mutations/StandFromTableMutation';

class Seat extends React.Component {
  state = {
    modalOpen: false,
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  }

  handleOk = () => {
    this.props.standFromTable();
  }

  handleCancel = () => {
    this.setState({ modalOpen: false });
  }

  renderHand() {
    const { currentHand } = this.props
    if (!currentHand) return null;

    const { viewerCards } = currentHand;

    if (this.props.seat.isViewer && viewerCards) {
      return (
        <Flex ml={1}>
          {viewerCards.map((card, idx) => <PokerCard card={card} key={idx} />)}
        </Flex>
      );
    }

    return (
      <Flex ml={1}>
        {[1, 2].map(idx => <PokerCard key={idx} />)}
      </Flex>
    );
  }

  renderBet() {
    const { number, currentHand } = this.props;
    if (!currentHand) return null;

    const { bets } = currentHand;
    const bet = bets[`seat${number}Bet`];
    if (!bet) return null;

    return (
      <Box className="bet">
        ${bet}
        <Chips bg="lightgray" />
      </Box>
    )
  }

  render() {
    const { number, stackAmount, user, isViewer, isTurn, isButton } = this.props.seat;

    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={this.openModal}>
          Stand up
        </Menu.Item>
      </Menu>
    );

    return (
      <Box className={css`position: relative;`}>
        {this.renderHand()}

        <Nameplate
          number={number}
          user={user}
          stackAmount={stackAmount}
          isTurn={isTurn}
          isButton={isButton}
        />

        {isViewer && (
          <Dropdown overlay={menu} trigger={['click']} className={css`position: absolute;`}>
            <Icon type="down" />
          </Dropdown>
        )}

        {this.renderBet()}

        <Modal
          title="Are you sure you want to stand up?"
          visible={this.state.modalOpen}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          You will automatically fold any hands that are in progress.
        </Modal>
      </Box>
    )
  }
}

export default ({ tableEntityId, ...rest }) => (
  <StandFromTableMutation>
    {(standFromTable, { data, loading, error }) => (
      <Seat
        {...rest}
        standFromTable={() =>
          standFromTable({
            variables: { tableEntityId },
          })
        }
      />
    )}
  </StandFromTableMutation>
);