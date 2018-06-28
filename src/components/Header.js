import React from 'react';
import { Link } from 'react-router-dom';
import { Flex } from 'grid-styled';
import { Consumer } from '../auth';
import firebase from '../firebase';

const Header = () => (
  <header>
    <Flex wrap={false} justify="space-between">
      <h1>Mood.</h1>
      <ul>
        <li>
          <Link to="/boards">My Boards</Link>
        </li>
        <li>
          <Consumer>
            {({ authenticated }) =>
              authenticated && (
                <button type="button" onClick={firebase.logout}>
                  Logout
                </button>
              )
            }
          </Consumer>
        </li>
      </ul>
    </Flex>
  </header>
);

export default Header;
