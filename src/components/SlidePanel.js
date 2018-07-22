import styled from 'styled-components'

export default styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 400px;
  height: 100vh;
  right: 0;
  top: 0;
  background: white;
  z-index: 10;
  box-shadow: -10px 0 20px 0 rgba(0, 0, 2, 0.075);
  transform: translateX(${p => (p.visible ? 0 : '100%')});
  transition: transform 200ms ease-out;
`
