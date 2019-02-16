import React from 'react';
import { Input } from 'antd';
import AddMessageMutation from './AddMessageMutation';

class AddMessageInput extends React.Component {
  state = {
    message: '',
  }

  handleChange = e => {
    e.preventDefault();
    this.setState({ message: e.target.value });
  }

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      this.props.addMessage({ body: this.state.message });
      this.setState({ message: '' });
    }
  }

  render() {
    return (
      <Input
        value={this.state.message}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        placeholder="Enter a message"
      />
    )
  }
}

export default ({ tableEntityId }) => (
  <AddMessageMutation>
    {(addMessage, { data, loading, error }) => (
      <AddMessageInput
        addMessage={({ body }) =>
          addMessage({ variables: { body, tableEntityId } })
        }
      />
    )}
  </AddMessageMutation>
)