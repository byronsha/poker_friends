import React, { Component } from 'react'
import { Route } from "react-router-dom";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import PageContainer from '../PageContainer';

const AUTH_TOKEN = 'poker_friends'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $username: String!) {
    signup(email: $email, password: $password, username: $username)
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    username: '',
  }

  render() {
    const { login, email, password, username } = this.state
    return (
      <div>
        <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
        <div className="flex flex-column">
          {!login && (
            <input
              value={username}
              onChange={e => this.setState({ username: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt3">
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, username }}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={mutation}>
                {login ? 'login' : 'create account'}
              </div>
            )}
          </Mutation>
          <div
            className="pointer button"
            onClick={() => this.setState({ login: !login })}
          >
            {login
              ? 'need to create an account?'
              : 'already have an account?'}
          </div>
        </div>
      </div>
    )
  }

  _confirm = async data => {
    console.log('Logged in!!', data)
    const token = this.state.login ? data.login : data.signup
    this._saveUserData(token)
    this.props.history.push(`/pins`)
  }

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token)
  }
}

export default () => (
  <Route path="/login" component={props => (
    <PageContainer>
      <Login {...props} />
    </PageContainer>
  )} />
);