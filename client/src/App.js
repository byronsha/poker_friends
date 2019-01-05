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
import { Box, Card } from 'rebass';
import theme from './theme'

import LeftNav from './components/LeftNav';
import TopNav from './components/TopNav';
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
            <Box bg="background" style={{ height: '100vh' }}>
              <LeftNav />
              <TopNav />

              <Card m={4} p={3} bg="white" borderRadius={2} style={{
                width: 'calc(100vw - 304px)',
                marginLeft: '280px',
                marginRight: '24px',
                position: 'absolute',
                height: 'calc(100vh - 112px)',
              }}>
                <Login />
                <Groups />
                <Group />
                <Pins />
              </Card>
            </Box>
          </ThemeProvider>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;