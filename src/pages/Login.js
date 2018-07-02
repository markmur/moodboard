import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flex } from 'grid-styled';
import styled, { css } from 'styled-components';
import * as firebaseui from 'firebaseui';
import firebase, { auth } from '../firebase';
import { Logo } from '../styles';
import 'firebaseui/dist/firebaseui.css';

const loginStyles = css`
  height: 100vh;
  text-align: center;
  max-width: 300px;
  margin: auto;
`;

const Description = styled.p`
  color: #222;
  font-size: 17px;
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
      signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID,
        auth.GithubAuthProvider.PROVIDER_ID,
        auth.TwitterAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccessWithAuthResult: authResult => {
          const { user } = authResult;
          console.log('signInSuccessWithAuthResult', user);

          firebase.createOrUpdateUser(user).then(() => {
            this.props.history.replace({
              pathname: '/boards'
            });
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
        <Logo mb={0} fontSize="8rem" />
        <Description>Create beatiful moodboards.</Description>

        {this.state.loading && <div>Loading...</div>}
        <div id="firebaseui-auth-container" />
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
