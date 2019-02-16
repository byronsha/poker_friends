import React from 'react';
import styled from 'styled-components';
import { Box, Flex, Text } from 'rebass';
import { Button as AntButton, InputNumber } from 'antd';
import EditBankrollMutation from './EditBankrollMutation';

const Button = styled(AntButton)`margin-right: 8px;`;

class PlayerBankroll extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      amount: props.currentBankroll,
    }
  }

  handleEdit = e => {
    this.setState({ editing: true });
  }

  handleCancel = e => {
    this.setState({ editing: false });
  }

  handleSubmit = e => {
    this.props.editBankroll(this.state.amount);
    this.setState({ editing: false });
  }

  handleChange = amount => {
    this.setState({ amount })
  }

  render() {
    if (!this.props.viewerCanEdit) {
      return <Text>${this.props.currentBankroll}</Text>
    }

    return (
      <Flex justifyContent="space-between">
        {this.state.editing ? (
          <InputNumber
            min={0}
            defaultValue={this.props.currentBankroll}
            onChange={this.handleChange}
            size="small"
            formatter={value => `$${value}`}
          />
        ) : (
          <Text>${this.props.currentBankroll}</Text>
        )}

        <Box style={{ paddingRight: '24px' }}>
          {this.state.editing ? (
            <Flex>
              <Button type="primary" size="small" onClick={this.handleSubmit}>
                Save
              </Button>
              <Button size="small" onClick={this.handleCancel}>
                Cancel
              </Button>
            </Flex>
          ) : (
            <Button type="primary" size="small" onClick={this.handleEdit}>
              Edit
            </Button>
          )}
        </Box>
      </Flex>
    )
  }
}

export default ({ userEntityId, groupEntityId, viewerCanEdit, currentBankroll }) => (
  <EditBankrollMutation>
    {(editBankroll, { data, loading, error }) => (
      <PlayerBankroll
        viewerCanEdit={viewerCanEdit}
        currentBankroll={currentBankroll}
        editBankroll={newBankroll =>
          editBankroll({ variables: { userEntityId, groupEntityId, bankroll: newBankroll } })
        }
      />
    )}
  </EditBankrollMutation>
)