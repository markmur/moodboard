import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Button = styled(props => (
  <div type="button" {...props}>
    {props.children}
  </div>
))`
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
  background: blue;
  color: white;
  cursor: pointer;

  a {
    display: block;
    padding: 1em 2em;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  ${props => props.theme.borderRadius};
`;

Button.propTypes = {
  children: PropTypes.any.isRequired
};

export default Button;
