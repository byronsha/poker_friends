import React, { Component } from "react";
import { Query, Mutation } from "react-apollo";
import { Spinner } from "apollo-subscription-example-components";
import gql from "graphql-tag";
import PinListPage from './PinListPage';
import AddPinPage from './AddPinPage';

const PINS_QUERY = gql`
  {
    pins {
      title
      link
      image
      id
    }
  }
`;

const PINS_SUBSCRIPTION = gql`
  subscription {
    pinAdded {
      title
      link
      image
      id
    }
  }
`;

const PinsQuery = ({ children }) => (
  <Query query={PINS_QUERY}>
    {({ loading, error, data, subscribeToMore }) => {
      if (loading)
        return (
          <div style={{ paddingTop: 20 }}>
            <Spinner show />
          </div>
        );
      if (error) return <p>Error :(</p>;
      const subscribeToMorePins = () => {
        subscribeToMore({
          document: PINS_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data || !subscriptionData.data.pinAdded)
              return prev;
            const newPinAdded = subscriptionData.data.pinAdded;

            return Object.assign({}, prev, {
              pins: [...prev.pins, newPinAdded]
            });
          }
        });
      };

      return children(data.pins, subscribeToMorePins);
    }}
  </Query>
);

const AddPinMutation = ({ children }) => (
  <Mutation
    mutation={gql`
      mutation AddPin($title: String!, $link: String!, $image: String!) {
        addPin(title: $title, link: $link, image: $image)
      }
    `}
  >
    {(addPin, { data, loading, error }) =>
      children(addPin, { data, loading, error })
    }
  </Mutation>
);

class Pins extends Component {
  componentDidMount() {
    this.props.subscribeToMorePins();
  }

  render() {
    return (
      <div>
        <PinListPage pins={this.props.pins} />
        <AddPinMutation>
          {(addPin, { data, loading, error }) => (
            <AddPinPage
              addPin={({ title, link, image }) =>
                addPin({ variables: { title, link, image } })
              }
            />
          )}
        </AddPinMutation>
      </div>
    );
  }
}

export default () => (
  <PinsQuery>
    {/* Wrap App with PinsQuery because we need to access subscribeToMorePins in componentDidMount */}
    {(pins, subscribeToMorePins) => (
      <Pins pins={pins} subscribeToMorePins={subscribeToMorePins} />
    )}
  </PinsQuery>
);