import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { auth } from './firebase';

const defaultAuthContext = {
  authenticated: false,
  user: null,
  loading: true
};

const AuthContext = React.createContext(defaultAuthContext);

class FirebaseAuthProvider extends Component {
  state = defaultAuthContext;

  componentDidMount() {
    this.removeAuthListener = auth().onAuthStateChanged(user => {
      this.setState(
        user
          ? {
              loading: false,
              authenticated: true,
              user
            }
          : defaultAuthContext,
        this.redirect
      );
    });
  }

  componentWillUnmount() {
    this.removeAuthListener();
  }

  redirect() {
    const { location, history } = this.props;
    const route =
      location.pathname === '/login' ? '/boards' : location.pathname;

    return history.replace(route);
  }

  getUser({ displayName, photoURL, uid }) {
    return {
      displayName,
      photoURL,
      uid
    };
  }

  render() {
    return (
      <AuthContext.Provider value={this.state}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

FirebaseAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired
  }).isRequired
};

export const { Consumer } = AuthContext;

export const Provider = withRouter(FirebaseAuthProvider);
