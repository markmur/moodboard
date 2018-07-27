import React from 'react'
import styled from 'styled-components'
import { space } from 'styled-system'

export default styled(({ size, ...props }) => (
  <svg
    width={size}
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
  >
    <path d="M17 11v3l-3-3h-6c-1.105 0-2-0.895-2-2v0-7c0-1.1 0.9-2 2-2h10c1.105 0 2 0.895 2 2v0 7c0 1.105-0.895 2-2 2v0h-1zM14 13v2c0 1.105-0.895 2-2 2v0h-6l-3 3v-3h-1c-1.105 0-2-0.895-2-2v0-7c0-1.1 0.9-2 2-2h2v3c0 2.209 1.791 4 4 4v0h6z" />
  </svg>
))`
  path {
    fill: ${p => p.theme.colors[p.color] || p.color};
  }

  ${space};
`
