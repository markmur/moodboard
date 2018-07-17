import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Flex } from 'grid-styled'
import { withRouter } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { withLastLocation } from 'react-router-last-location'
import * as firebaseui from 'firebaseui'
import firebase, { auth } from '../services/firebase'
import { Logo } from '../styles'
import 'firebaseui/dist/firebaseui.css'

const loginStyles = css`
  height: 100vh;
  text-align: center;
  max-width: 300px;
  margin: auto;
`

const Description = styled.p`
  color: #222;
  font-size: 17px;
  margin-bottom: 2em;
`

class Login extends Component {
  state = {
    loading: true
  }

  componentDidMount() {
    const { lastLocation } = this.props
    let ui = firebaseui.auth.AuthUI.getInstance()

    if (!ui) {
      ui = new firebaseui.auth.AuthUI(auth())
    }

    ui.start('#firebaseui-auth-container', {
      signInFlow: 'popup',
      signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.GithubAuthProvider.PROVIDER_ID,
        auth.TwitterAuthProvider.PROVIDER_ID
      ],
      signInSuccessUrl: lastLocation || '/',
      callbacks: {
        signInSuccessWithAuthResult: async authResult => {
          const { user } = authResult

          await firebase.createOrUpdateUser(user)
        },
        uiShown: () => {
          this.setState({ loading: false })
        }
      }
    })
  }

  render() {
    return (
      <Flex
        flexDirection="column"
        justify="center"
        className={this.props.className}
      >
        <Logo mb={0} fontSize="8rem" />
        <Description>Create beatiful moodboards.</Description>

        {this.state.loading && <div>Loading...</div>}
        <div id="firebaseui-auth-container" />
      </Flex>
    )
  }
}

Login.defaultProps = {
  className: ''
}

Login.propTypes = {
  className: PropTypes.string,
  lastLocation: PropTypes.string.isRequired
}

export default withLastLocation(withRouter(styled(Login)(loginStyles)))
