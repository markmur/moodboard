import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Flex } from 'grid-styled';
import styled from 'styled-components';
import { Consumer } from '../AuthProvider';
import firebase from '../firebase';
import { Avatar } from '../styles';

const Nav = styled.header`
  background: white;
  padding: 0.75em ${p => p.theme.contentPadding};
  margin-bottom: 2em;

  h1 {
    font-weight: bolder;
  }

  ul {
    display: flex;
    align-items: center;

    li {
      padding-left: 2em;
    }

    li a {
      padding: 0.5em 0;
    }
  }
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
                  <a
                    type="button"
                    style={{ cursor: 'pointer' }}
                    onClick={firebase.logout}
                  >
                    Logout
                  </a>
                </li>
                <li>
                  <Avatar src={user.photoURL} />
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
