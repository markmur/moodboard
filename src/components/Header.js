import React from 'react';
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

    li a {
      padding: 0.5em 1em;
    }
  }
`;

const Header = () => (
  <Nav>
    <Flex flexWrap={false} justify="space-between" align="center">
      <h1>
        <Link to="/">Mood.</Link>
      </h1>
      <ul>
        <li>
          <Link to="/boards">My Boards</Link>
        </li>
        <li>
          <Link to="/boards/new">New Board</Link>
        </li>
        <li>
          <Consumer>
            {({ authenticated }) =>
              authenticated && (
                <a type="button" onClick={firebase.logout}>
                  Logout
                </a>
              )
            }
          </Consumer>
        </li>
      </ul>
    </Flex>
  </Nav>
);

export default Header;
