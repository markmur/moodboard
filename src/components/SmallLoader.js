import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import { space } from 'styled-system'

const ripple = keyframes`
0% {
    transform: scale(.1);
    opacity: 1
}

70% {
    transform: scale(1);
    opacity: 0.7
}

100% {
    opacity: 0
}
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 30vh;
`

const Loader = ({ className, loading, fallback, showFallback, children }) => {
  if (!loading) {
    if (showFallback && fallback) return fallback
    return children
  }

  return (
    <Container>
      <div className={className}>
        <div />
        <div />
        <div />
      </div>
    </Container>
  )
}

Loader.propTypes = {
  className: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  fallback: PropTypes.node,
  showFallback: PropTypes.bool,
  children: PropTypes.node
}

Loader.defaultProps = {
  loading: false,
  fallback: null,
  showFallback: false,
  children: null
}

export default styled(Loader)`
  display: block;
  position: relative;
  margin: auto;
  height: 50px;
  text-align: center;

  ${space};

  > div:nth-child(0) {
    animation-delay: -0.8s;
  }

  > div:nth-child(1) {
    animation-delay: -0.6s;
  }

  > div:nth-child(2) {
    animation-delay: -0.4s;
  }

  > div:nth-child(3) {
    animation-delay: -0.2s;
  }

  > div {
    position: absolute;
    top: -2px;
    left: -26px;
    width: 50px;
    height: 50px;
    border-radius: 100%;
    border: 2px solid blue;
    animation: ${ripple} 1.25s 0s infinite cubic-bezier(0.21, 0.53, 0.56, 0.8);
  }
`
