import styled from 'styled-components'
import Textarea from 'react-textarea-autosize'

export const StyledTextarea = styled(Textarea)`
  width: 100%;
  background: #f4f4f7;
  border: 1px solid #eee;
  font-size: 16px;
  border-radius: 4px;
  padding: 0.7em;
  margin-right: 0.5em;
  resize: none;
  outline: none;

  &:hover {
    border: 1px solid rgba(0, 0, 255, 0.25);
  }

  &:active,
  &:focus {
    border: 1px solid blue;
  }
`

export const Header = styled.header`
  padding: 1.5em 2.5em;
`

export const Main = styled.main`
  background: #f4f4f7;
  padding: 1.5em 0.5em;
  flex: 1;
  overflow: scroll;
`

export const Footer = styled.footer`
  padding: 1em;

  form {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }
`
