import React from 'react';
import { Box } from 'rebass';
import { Button, Modal, Input, InputNumber } from 'antd';
import CreateTableMutation from './CreateTableMutation';

class CreateTableModal extends React.Component {
  getInitialState = () => ({
    visible: false,
    name: '',
    smallBlindAmount: 5,
    bigBlindAmount: 10,
    maxPlayers: 6,
  })

  state = this.getInitialState()

  resetState = () => {
    this.setState(this.getInitialState())
  }

  toggleModal = () => {
    this.setState({ visible: !this.state.visible });
  }

  handleNameChange = e => {
    e.preventDefault();
    this.setState({ name: e.target.value });
  }

  handleSmallBlindChange = amount => {
    this.setState({ smallBlindAmount: amount });
  }

  handleBigBlindChange = amount => {
    this.setState({ bigBlindAmount: amount });
  }

  handleMaxPlayersChange = maxPlayers => {
    this.setState({ maxPlayers });
  }

  isValid = () => {
    const { name, smallBlindAmount, bigBlindAmount, maxPlayers } = this.state;

    if (name.length === 0) return false;
    if (smallBlindAmount > bigBlindAmount) return false;
    if (maxPlayers < 2) return false;

    return true;
  }

  handleOk = () => {
    if (!this.isValid()) return;

    const { name, smallBlindAmount, bigBlindAmount, maxPlayers } = this.state;

    this.props.createTable({
      name,
      smallBlindAmount,
      bigBlindAmount,
      maxPlayers,
    });
    this.resetState();
  }

  handleCancel = () => {
    this.toggleModal();
    this.resetState();
  }

  render() {
    return (
      <Box>
        <Modal
          title="Create table"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: !this.isValid() }}
        >
          <Input
            type="text"
            value={this.state.name}
            onChange={this.handleNameChange}
            placeholder="Enter name"
          />

          Small blind
          <InputNumber
            defaultValue={this.state.smallBlindAmount}
            onChange={this.handleSmallBlindChange}
          />

          Big blind
          <InputNumber
            defaultValue={this.state.bigBlindAmount}
            onChange={this.handleBigBlindChange}
          />

          Max players
          <InputNumber
            defaultValue={this.state.maxPlayers}
            onChange={this.handleMaxPlayersChange}
          />
        </Modal>

        <Button onClick={this.toggleModal} type="primary">
          Create
        </Button>
      </Box>
    )
  }
}

export default ({ groupEntityId }) => (
  <CreateTableMutation>
    {(createTable, { data, loading, error }) => (
      <CreateTableModal
        createTable={({ name, smallBlindAmount, bigBlindAmount, maxPlayers }) =>
          createTable({
            variables: {
              groupEntityId,
              name,
              smallBlindAmount,
              bigBlindAmount,
              maxPlayers,
            },
          })
        }
      />
    )}
  </CreateTableMutation>
)