import React from 'react'
import styled from 'styled-components'
import { Box } from 'grid-styled'
import { Content } from '../styles'

export default styled(props => (
  <footer {...props}>
    <Content>
      <div>
        Built by{' '}
        <a rel="noopener noreferrer" href="https://github.com/markmur">
          <strong>Mark Murray</strong>
        </a>
      </div>

      <Box mt={3}>
        <a
          rel="noopener noreferrer"
          href="https://github.com/markmur/moodboard"
        >
          View source on GitHub
        </a>
      </Box>
    </Content>
  </footer>
))`
  background: black;
  color: white;
  padding: 2.5em 1em;
  height: ${p => p.theme.footerHeight}px;
  z-index: -1;

  strong {
    border-bottom: 2px solid;
  }
`
