import React from 'react'
import styled from 'styled-components'
import { fontSize, color, space } from 'styled-system'

const hoverColor = p => `
&:hover {
  color: ${p.theme.colors[p.hoverColor] || p.hoverColor};
}
`

export default styled(({ type, className, ...props }) => (
  <i {...props} className={`icon-${type} ${className}`} />
))`
  ${p => p.pointer && 'cursor: pointer'};
  ${fontSize};
  ${color};
  ${space};
  ${hoverColor};
`
