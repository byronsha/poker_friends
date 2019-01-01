import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { setContext } from 'apollo-link-context'
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { ThemeProvider } from 'styled-components'
import { Box } from 'rebass';
import theme from './theme'

import Nav from './components/Nav';
import Login from './components/Login';
import Groups from './components/Groups';
import Group from './components/Group';
import Pins from './components/Pins';

const AUTH_TOKEN = 'poker_friends'
const authLink = setContext(() => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3001/subscriptions',
  options: {
    reconnect: true,
    connectionParams: () => ({
      authToken: localStorage.getItem(AUTH_TOKEN),
    }),
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) {
        console.log(`[Network error]:`);
        console.log(networkError)
      }
    }),
    authLink,
    wsLink,
    new HttpLink({
      uri: 'http://localhost:3001/graphql',
      credentials: "same-origin",
    }),
  ]),
  cache: new InMemoryCache()
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <ThemeProvider theme={theme}>
            <Box style={{ height: '100vh' }}>
              <Nav />
              <Box p={3} style={{
                width: 'calc(100vw - 250px)',
                marginLeft: '250px',
                position: 'absolute',
                height: '100vh',
              }}>
                <Login />
                <Groups />
                <Group />
                <Pins />
              </Box>
            </Box>
          </ThemeProvider>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;