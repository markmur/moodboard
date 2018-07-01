import styled from 'styled-components';

export const Avatar = styled.img.attrs({
  width: p => p.size || 35
})`
  border-radius: 50%;
`;
