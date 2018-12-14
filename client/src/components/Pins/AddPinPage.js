import React from "react";
import { Route } from "react-router-dom";

class AddPinPage extends React.Component {
  state = {
    title: "",
    link: "",
    image: ""
  };
  render() {
    return (
      <div>
        <h2>Add pin</h2>
        <form
          style={{ display: "grid", gridGap: 20 }}
          onSubmit={event => {
            this.setState({
              title: "",
              link: "",
              image: ""
            });
            this.props.addPin({
              title: this.state.title,
              link: this.state.link,
              image: this.state.image
            });
            this.props.history.push("/");
            event.preventDefault();
          }}
        >
          <input
            className="input"
            value={this.state.title}
            onChange={event => this.setState({ title: event.target.value })}
            placeholder="Title"
            type="text"
            required
            autoFocus
          />
          <input
            className="input"
            value={this.state.link}
            onChange={event => this.setState({ link: event.target.value })}
            placeholder="URL"
            type="url"
            required
          />
          <input
            className="input"
            value={this.state.image}
            onChange={event => {
              this.setState({
                image: event.target.value
              });
            }}
            placeholder="Image URL"
            type="url"
            required
          />
          <button type="submit">
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default ({ addPin = () => { } }) => (
  <Route
    path="/upload-pin"
    component={props => <AddPinPage {...props} addPin={addPin} />}
  />
);