import React from 'react';
import { Button } from 'antd';
import RejectInviteMutation from './RejectInviteMutation';

class RejectInviteButton extends React.Component {
  handleClick = e => {
    e.preventDefault();
    this.props.rejectGroupInvite();
  }

  render() {
    return (
      <Button type="primary" size="small" onClick={this.handleClick}>
        Reject
      </Button>
    )
  }
}

export default ({ groupEntityId }) => (
  <RejectInviteMutation>
    {(rejectGroupInvite, { data, loading, error }) => (
      <RejectInviteButton
        rejectGroupInvite={() =>
          rejectGroupInvite({ variables: { groupEntityId } })
        }
      />
    )}
  </RejectInviteMutation>
)