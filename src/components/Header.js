import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Flex } from 'grid-styled';
import styled from 'styled-components';
import { Consumer } from '../AuthProvider';
import firebase from '../firebase';

const Nav = styled.header`
  background: white;
  padding: 1em 2em;
  margin-bottom: 2em;

  h1 {
    font-weight: bolder;
  }

  ul {
    display: flex;
    align-items: center;

    li a {
      padding: 0.5em 1em;
    }
  }
`;

const Avatar = styled.img.attrs({
  width: 35
})`
  border-radius: 50%;
`;

const Header = () => (
  <Nav>
    <Flex flexWrap={false} justify="space-between" align="center">
      <Link to="/">
        <h1>Mood.</h1>
      </Link>
      <ul>
        <li>
          <Link to="/boards">My Boards</Link>
        </li>
        <Consumer>
          {({ authenticated, user }) =>
            authenticated && (
              <Fragment>
                <li>
                  <Avatar src={user.photoURL} />
                </li>
                <li>
                  <a
                    type="button"
                    style={{ cursor: 'pointer' }}
                    onClick={firebase.logout}
                  >
                    Logout
                  </a>
                </li>
              </Fragment>
            )
          }
        </Consumer>
      </ul>
    </Flex>
  </Nav>
);

export default Header;
