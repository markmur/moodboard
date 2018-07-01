import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'grid-styled';
import styled, { css } from 'styled-components';
import * as firebaseui from 'firebaseui';
import firebase, { auth } from '../firebase';
import 'firebaseui/dist/firebaseui.css';

const loginStyles = css`
  height: 100vh;
  text-align: center;
  max-width: 300px;
  margin: auto;
`;

const Heading = styled.h1`
  font-size: 7rem;
  font-weight: bolder;
`;

const Description = styled.p`
  color: #333;
  margin-bottom: 2em;
`;

class Login extends Component {
  state = {
    loading: true
  };

  componentDidMount() {
    let ui = firebaseui.auth.AuthUI.getInstance();

    if (!ui) {
      ui = new firebaseui.auth.AuthUI(auth());
    }

    ui.start('#firebaseui-auth-container', {
      signInFlow: 'popup',
      signInOptions: [auth.GoogleAuthProvider.PROVIDER_ID],
      callbacks: {
        signInSuccessWithAuthResult: authResult => {
          const { user } = authResult;
          console.log('signInSuccessWithAuthResult', user);

          firebase.createOrUpdateUser(user).then(() => {
            this.props.history.replace('/boards');
          });
        },
        uiShown: () => {
          this.setState({ loading: false });
        }
      }
    });
  }

  render() {
    return (
      <Flex
        flexDirection="column"
        justify="center"
        className={this.props.className}
      >
        <Heading>Mood.</Heading>
        <Description>Create beatiful moodboards.</Description>

        {this.state.loading && <div>Loading...</div>}
        {!this.state.loading && <div id="firebaseui-auth-container" />}
      </Flex>
    );
  }
}

Login.defaultProps = {
  className: ''
};

Login.propTypes = {
  className: PropTypes.string,
  history: PropTypes.shape({
    replace: PropTypes.func
  }).isRequired
};

export default styled(Login)(loginStyles);
