import React from 'react';
import styled from 'styled-components';
import { height, space, fontSize, color, size } from 'styled-system';
import { Link } from 'react-router-dom';

export const Avatar = styled.img.attrs({
  width: p => p.size || 35
})`
  border-radius: 50%;
`;

export const Logo = styled(props => (
  <Link {...props} to="/">
    <h1>Mood.</h1>
  </Link>
))`
  h1 {
    font-family: var(--logo-font);
    color: blue;
    ${size};
    ${fontSize};
  }
`;

export const Container = styled.div`
  max-width: ${p => p.width || 1200}px;
  margin: auto;
  ${space};
`;

export const Content = styled.div`
  padding: 0 ${p => p.theme.contentPadding};
  margin: auto;
  ${space};
  ${color};
  ${size};
  ${height};
`;

export const Avatars = ({ profiles = [], size }) =>
  profiles.map(({ email, photoURL }) => (
    <Avatar key={email} size={size} src={photoURL} />
  ));

export const Error = styled.small`
  display: block;
  color: red;
  font-weight: bold;
  margin-bottom: 5px;
`;

export const Label = styled.label`
  display: block;
  color: black;
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  display: block;
  background: white;
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
  font-size: 16px;
  margin-bottom: 1.5em;
`;

export const SubmitButton = styled.input.attrs({
  type: 'submit'
})`
  cursor: pointer;
  display: block;
  background: blue;
  color: white;
  padding: 1em;
  width: 100%;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;

  &:hover {
    background: #222;
  }
`;

export const Textarea = Input.withComponent('textarea');
