import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import { Flex } from 'grid-styled'
import styled from 'styled-components'
import { Consumer } from '../context/Auth'
import firebase from '../services/firebase'
import { Avatar, Logo } from '../styles'

const Nav = styled.header`
  background: white;
  padding: 0.75em ${p => p.theme.contentPadding};
  height: ${p => p.theme.headerHeight}px;

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
`

const Header = ({ history }) => (
  <Nav>
    <Flex flexWrap="nowrap" justify="space-between" align="center">
      <Logo />
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
                    onClick={() =>
                      firebase.signOut().then(() => history.replace('/login'))
                    }
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
)

Header.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func
  }).isRequired
}

export default withRouter(Header)
