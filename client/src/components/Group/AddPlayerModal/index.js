import React from 'react';
import { Box } from 'rebass';
import { Button, Modal } from 'antd';
import UserSearch from '../../UserSearch';

class AddPlayerModal extends React.Component {
  state = {
    visible: false,
  }

  handleClick = () => {
    this.setState({ visible: !this.state.visible })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  render() {
    return (
      <Box my={2}>
        <Modal
          title="Invite player"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <UserSearch />
        </Modal>

        <Button onClick={this.handleClick} type="primary">Invite player</Button>
      </Box>
    )
  }
}

export default AddPlayerModal;