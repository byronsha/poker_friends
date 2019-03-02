import React from 'react';
import { Box, Text } from 'rebass';
import { Modal, InputNumber } from 'antd';

import SitAtTableMutation from '../mutations/SitAtTableMutation';

const noop = () => {};

class EmptySeat extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modalOpen: false,
      buyin: props.bigBlindAmount * 100,
    }
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  }

  onBuyinChange = buyin => {
    this.setState({ buyin });
  }

  handleOk = () => {
    this.props.sitAtTable(this.state.buyin);
  }

  handelCancel = () => {
    this.setState({
      modalOpen: false,
      buyin: this.props.bigBlindAmount * 100,
    });
  }

  render() {
    const { number, bigBlindAmount, disabled } = this.props;

    return (
      <div>
        <Box onClick={disabled ? noop : this.openModal}>
          <Text>{number}</Text>
          <Text>Sit here {disabled ? '(disabled)' : ''}</Text>
        </Box>

        <Modal
          title="How much will you buy in for?"
          visible={this.state.modalOpen}
          onOk={this.handleOk}
          onCancel={this.handelCancel}
        >
          <InputNumber
            defaultValue={bigBlindAmount * 100}
            min={bigBlindAmount * 50}
            max={bigBlindAmount * 100}
            step={this.props.bigBlindAmount}
            onChange={this.onBuyinChange}
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            style={{ marginLeft: '24px', width: 'calc(35% - 24px)' }}
          />
        </Modal>
      </div>
    )
  }
}

export default ({ number, tableEntityId, bigBlindAmount, disabled }) => (
  <SitAtTableMutation>
    {(sitAtTable, { data, loading, error }) => (
      <EmptySeat
        number={number}
        bigBlindAmount={bigBlindAmount}
        disabled={disabled}
        sitAtTable={buyin =>
          sitAtTable({
            variables: {
              tableEntityId,
              seat: number,
              stackAmount: buyin,
            },
          })
        }
      />
    )}
  </SitAtTableMutation>
)