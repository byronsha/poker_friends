import React from 'react';
import { Box } from 'rebass';
import { Button, Modal } from 'antd';
import AddPlayerMutation from './AddPlayerMutation';
import UserSearch from '../../UserSearch';

class AddPlayerModal extends React.Component {
  getInitialState = () => ({
    visible: false,
    user: null,
    bankroll: 100,  
  })

  state = this.getInitialState()

  resetState = () => {
    this.setState(this.getInitialState())
  }  

  toggleModal = () => {
    this.setState({ visible: !this.state.visible })
  }

  handleUserSelect = user => {
    this.setState({ user })
  }

  handleBankrollChange = amount => {
    this.setState({ bankroll: amount })
  }

  handleOk = () => {
    if (!this.state.user) return

    this.props.addPlayer({ 
      userEntityId: this.state.user.entityId,
      bankroll: this.state.bankroll,
    })
    this.resetState()
  }

  render() {
    return (
      <Box>
        <Modal
          title="Invite player"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.toggleModal}
          okButtonProps={{ disabled: !this.state.user }}
        >
          <UserSearch
            user={this.state.user}
            bankroll={this.state.bankroll}
            onUserSelect={this.handleUserSelect}
            onBankrollChange={this.handleBankrollChange}
          />
        </Modal>

        <Button onClick={this.toggleModal} type="primary">
          Invite player
        </Button>
      </Box>
    )
  }
}

export default ({ groupEntityId }) => (
  <AddPlayerMutation>
    {(addPlayer, { data, loading, error }) => (
      <AddPlayerModal
        addPlayer={({ userEntityId, bankroll }) =>
          addPlayer({ variables: { groupEntityId, userEntityId, bankroll } })
        }
      />
    )}
  </AddPlayerMutation>
)