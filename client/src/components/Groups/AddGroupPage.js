import React from "react";
import { Route } from "react-router-dom";

class AddGroupPage extends React.Component {
  state = {
    name: "",
  };

  handleSubmit = event => {
    this.setState({ name: "" });
    this.props.addGroup({ name: this.state.name });
    this.props.history.push("/groups");
    event.preventDefault();
  }
  
  render() {
    return (
      <div>
        <h2>Create group</h2>
        <form
          style={{ display: "grid", gridGap: 20 }}
          onSubmit={this.handleSubmit}
        >
          <input
            className="input"
            value={this.state.name}
            onChange={event => this.setState({ name: event.target.value })}
            placeholder="Name"
            type="text"
            required
            autoFocus
          />
          <button type="submit">
            Create group
          </button>
        </form>
      </div>
    );
  }
}

export default ({ addGroup = () => { } }) => (
  <Route
    path="/create-group"
    component={props => <AddGroupPage {...props} addGroup={addGroup} />}
  />
);