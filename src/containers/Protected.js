import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { Consumer } from '../auth';

class Protected extends Component {
  render() {
    const { children } = this.props;
    return (
      <Consumer>
        {({ authenticated }) => {
          if (authenticated) {
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
