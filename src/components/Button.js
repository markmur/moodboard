import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { space } from 'styled-system'

const type = p => {
  switch (p.type) {
    case 'success':
      return `background: ${p.theme.colors.success}`
    default:
      return 'background: blue'
  }
}

class Button extends Component {
  static defaultProps = {
    children: '',
    hoverText: '',
    className: '',
    to: null,
    tag: 'a'
  }

  static propTypes = {
    children: PropTypes.string,
    hoverText: PropTypes.string,
    className: PropTypes.string,
    to: PropTypes.string,
    tag: PropTypes.string
  }

  state = {
    hover: false
  }

  updateState = hover => () => this.setState({ hover })

  render() {
    const { hover } = this.state
    const { children, hoverText, className, to, tag, ...rest } = this.props
    const text = hoverText && hover ? hoverText : children

    const Tag = to ? Link : tag

    return (
      <Tag
        {...rest}
        to={to}
        className={className}
        onMouseOver={this.updateState(true)}
        onMouseOut={this.updateState(false)}
        type="button"
      >
        {text}
      </Tag>
    )
  }
}

export const SubmitButton = styled.input.attrs({
  type: 'submit',
  primary: true
})`
  display: inline-block;
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
  color: white !important;
  cursor: pointer;
  padding: 1em 2em;

  ${type};

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  ${props => props.theme.borderRadius};
  ${space};
`

export default styled(Button)`
  display: block;
  white-space: nowrap;
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
  color: white !important;
  cursor: pointer;
  padding: 1em 2em;
  border: none;
  box-shadow: ${p => p.theme.shadow};

  ${type};

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  ${props => props.theme.borderRadius};
  ${space};
`
