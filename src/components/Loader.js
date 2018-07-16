import styled, { keyframes } from 'styled-components'

const animation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`

const Loader = styled.div`
  position: fixed;
  width: 100%;
  height: 6px;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    238deg,
    #fd8800,
    #fd008f,
    #9700fd,
    #003dfd,
    #05c7e6,
    #4bd58d
  );
  background-size: 1200% 1200%;
  animation: ${animation} 2s ease infinite;
  z-index: 90;
`

export default Loader
