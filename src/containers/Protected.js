import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Consumer } from '../AuthProvider';

class Protected extends Component {
  render() {
    const { children } = this.props;
    return (
      <Consumer>
        {({ authenticated, loading }) => {
          if (loading) return null;

          if (authenticated && !loading) {
            console.log('Authenticated, displaying content.');
            return children;
          }

          console.log('Redirecting to login...');
          return <Redirect to="/login" />;
        }}
      </Consumer>
    );
  }
}

Protected.propTypes = {
  children: PropTypes.node.isRequired
};

export default Protected;
