import React from 'react';
import { Box } from 'rebass';
import { Button, Modal, Input } from 'antd';
import AddGroupMutation from './AddGroupMutation';

class AddGroupModal extends React.Component {
  state = {
    visible: false,
    name: '',
  }

  resetState = () => {
    this.setState({ visible: false, name: '' })
  }

  toggleModal = () => {
    this.setState({ visible: !this.state.visible })
  }

  handleChange = e => {
    e.preventDefault()
    this.setState({ name: e.target.value })
  }

  handleOk = () => {
    if (this.state.name === '') return;
    this.props.addGroup({ name: this.state.name });
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
          title="Create group"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="Create"
          okButtonProps={{ disabled: this.state.name === '' }}
        >
          <Input
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Group name"
          />
        </Modal>

        <Button onClick={this.toggleModal} type="primary">
          Create group
        </Button>
      </Box>
    )
  }
}

export default () => (
  <AddGroupMutation>
    {(addGroup, { data, loading, error }) => (
      <AddGroupModal
        addGroup={({ name }) =>
          addGroup({ variables: { name } })
        }
      />
    )}
  </AddGroupMutation>
)