import React from 'react';
import { Box, Text } from 'rebass';
import { Menu, Dropdown, Icon, Modal } from 'antd';

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

  handelCancel = () => {
    this.setState({ modalOpen: false });
  }

  render() {
    const { number, stackAmount, user, isViewer } = this.props.seat;

    const menu = (
      <Menu>
        <Menu.Item key="1" onClick={this.openModal}>
          Stand up
        </Menu.Item>
      </Menu>
    );

    return (
      <Box>
        <Text>{number} {user.username}</Text>
        <Text>$ {stackAmount}</Text>

        {isViewer && (
          <Dropdown overlay={menu} trigger={['click']}>
            <Icon type="down" />
          </Dropdown>
        )}

        <Modal
          title="Are you sure you want to stand up?"
          visible={this.state.modalOpen}
          onOk={this.handleOk}
          onCancel={this.handelCancel}
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