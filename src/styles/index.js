import React from 'react'
import styled from 'styled-components'
import { height, space, fontSize, color, size } from 'styled-system'
import { Link } from 'react-router-dom'

export const Avatar = styled.img.attrs({
  width: p => p.size || 35
})`
  border-radius: 50%;
  flex: 0 0 auto;
`

export const Truncate = styled(({ children, className }) => (
  <span className={className}>
    <span>{children}</span>
  </span>
))`
  overflow: hidden;

  > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

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
`

export const Container = styled.div`
  max-width: ${p => p.width || 1200}px;
  margin: auto;
  ${space};
`

export const Content = styled.div`
  padding: 0 ${p => p.theme.contentPadding};
  margin: auto;
  overflow: auto;

  ${p => (p.minHeight === true ? `min-height: ${p.theme.contentHeight}` : '')};
  ${space};
  ${color};
  ${size};
  ${height};
`

export const Avatars = ({ profiles = [], size }) =>
  profiles.map(({ email, photoURL }) => (
    <Avatar key={email} size={size} src={photoURL} />
  ))

export const Error = styled.small`
  display: block;
  color: red;
  font-weight: bold;
  margin-bottom: 5px;
`

export const Label = styled.label`
  display: block;
  color: ${p => p.theme.colors.label};
  font-weight: bold;
  font-size: 13px;
  margin-bottom: 8px;
`

export const Input = styled.input`
  display: block;
  background: ${p => p.theme.colors.input};
  padding: 10px 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  width: 100%;
  font-weight: bold;
  font-size: 23px;
  margin-bottom: 1.5em;
  outline: none;

  &::placeholder {
    color: ${p => p.theme.colors.placeholder};
  }

  &:hover {
    border: 1px solid rgba(0, 0, 255, 0.25);
  }

  &:active,
  &:focus {
    border: 1px solid blue;
  }
`

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
  border: none;
  box-shadow: ${p => p.theme.shadow};

  &:hover {
    background: #222;
  }
`

export const Textarea = Input.withComponent('textarea')
