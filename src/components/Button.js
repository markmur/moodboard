import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

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
    className: ''
  }

  static propTypes = {
    children: PropTypes.string,
    hoverText: PropTypes.string,
    className: PropTypes.string
  }

  state = {
    hover: false
  }

  updateState = hover => () => this.setState({ hover })

  render() {
    const { children, hoverText, className, ...rest } = this.props
    const { hover } = this.state

    let text

    if (hoverText && hover) text = hoverText
    else text = children

    return (
      <a
        {...rest}
        className={className}
        onMouseOver={this.updateState(true)}
        onMouseOut={this.updateState(false)}
        type="button"
      >
        {text}
      </a>
    )
  }
}

export default styled(Button)`
  display: block;
  font-size: 0.8em;
  font-weight: bold;
  text-transform: uppercase;
  color: white;
  cursor: pointer;
  padding: 1em 2em;

  ${type};

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  ${props => props.theme.borderRadius};
`
