import React from 'react';
import { Button } from 'antd';
import RescindInviteMutation from './RescindInviteMutation';

class RescindInviteButton extends React.Component {
  handleClick = e => {
    e.preventDefault();
    this.props.rescindGroupInvite();
  }

  render() {
    return (
      <Button type="primary" size="small" onClick={this.handleClick}>
        Rescind
      </Button>
    )
  }
}

export default ({ userEntityId, groupEntityId }) => (
  <RescindInviteMutation>
    {(rescindGroupInvite, { data, loading, error }) => (
      <RescindInviteButton
        rescindGroupInvite={() =>
          rescindGroupInvite({ variables: { userEntityId, groupEntityId }})
        }
      />
    )}
  </RescindInviteMutation>
)