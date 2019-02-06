import React from 'react';
import { Button } from 'antd';
import AcceptInviteMutation from './AcceptInviteMutation';

class AcceptInviteButton extends React.Component {
  handleClick = e => {
    e.preventDefault();
    this.props.acceptGroupInvite();
  }

  render() {
    return (
      <Button
        type="primary"
        size="small"
        onClick={this.handleClick}
        style={{ marginRight: '8px' }}
      >
        Accept invite
      </Button>
    )
  }
}

export default ({ groupEntityId }) => (
  <AcceptInviteMutation>
    {(acceptGroupInvite, { data, loading, error }) => (
      <AcceptInviteButton
        acceptGroupInvite={() =>
          acceptGroupInvite({ variables: { groupEntityId } })
        }
      />
    )}
  </AcceptInviteMutation>
)