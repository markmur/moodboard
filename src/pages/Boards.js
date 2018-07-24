import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Flex, Box } from 'grid-styled'
import styled from 'styled-components'
import { Consumer } from '../context/Auth'
import firebase from '../services/firebase'
import { Content } from '../styles'
import BoardIcon from '../icons/board'
import Icon from '../components/Icon'
import Loader from '../components/SmallLoader'

import { storePropTypes } from '../prop-types'

import Button from '../components/Button'

const Board = styled(Flex)`
  border: 1px solid ${p => p.theme.colors.gray};
  background: white;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.05);
  ${p => p.theme.borderRadius};
  box-shadow: ${p => p.theme.shadow};

  a {
    padding: 2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
`

const truncate = p =>
  p.truncate &&
  `
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const Description = styled.p.attrs({
  truncate: true
})`
  color: ${p => p.theme.colors.gray};
  ${truncate};
`

const Public = styled.small.attrs({
  children: 'Public'
})`
  margin-top: 5px;
  display: inline-block;
  visibility: ${p => (p.public ? 'visible' : 'hidden')};
  color: blue;
  margin-right: 5px;
  font-weight: bold;
`

class Boards extends Component {
  componentDidMount() {
    const { store } = this.props

    store.setGlobalLoadingState(true)
    store.subscribe('boards')
    store.subscribe('following')
  }

  componentWillUnmount() {
    this.props.store.unsubscribe('boards')
  }

  handleBoardDelete = boardId => event => {
    event.preventDefault()

    firebase.deleteBoard(boardId)
  }

  renderEmptyState() {
    return (
      <Flex
        mt={4}
        justify="center"
        flexDirection="column"
        textAlign="center"
        align="center"
      >
        <BoardIcon style={{ width: 300 }} />
        <Box mb={4}>
          <p>You have no boards yet. Get started by creating one!</p>
        </Box>
        <Button to="/boards/new">Create Board</Button>
      </Flex>
    )
  }

  render() {
    const { store } = this.props

    return (
      <Content minHeight pt={4} bg="white">
        <Flex justify="space-between" align="center">
          <h3>
            My Boards {!store.boards.loading && `(${store.boards.data.length})`}
          </h3>
          <Button to="/boards/new">Create Board</Button>
        </Flex>

        <Loader
          showFallback={!store.boards.hasData}
          loading={store.boards.loading}
          fallback={this.renderEmptyState()}
        >
          <Flex flexWrap="wrap" py={3} mx={-3}>
            {store.boards.data.map(board => (
              <Box
                key={board.id}
                mb={3}
                mx={0}
                px={3}
                width={[1, 1 / 2, 1 / 3]}
              >
                <Board>
                  <Link to={`/boards/${board.id}`}>
                    <div style={{ overflow: 'hidden' }}>
                      <h2>{board.name}</h2>
                      <Description>{board.description}</Description>
                      <Public public={board.public} />
                    </div>

                    <Icon
                      type="trash"
                      color="lightgray"
                      hoverColor="gray"
                      fontSize={20}
                      onClick={this.handleBoardDelete(board.id)}
                    />
                  </Link>
                </Board>
              </Box>
            ))}
          </Flex>
        </Loader>

        <Box mt={5}>
          <h3>
            Following{' '}
            {!store.following.loading && `(${store.following.data.length})`}
          </h3>

          <Loader
            showFallback={!store.following.hasData}
            loading={store.following.loading}
            fallback={<p>Boards you follow will appear here</p>}
          >
            <Flex flexWrap="wrap" py={3} mx={-3}>
              {store.following.data.map(board => (
                <Box
                  key={board.id}
                  mb={3}
                  mx={0}
                  px={3}
                  width={[1, 1 / 2, 1 / 3]}
                >
                  <Board>
                    <Link to={`/boards/${board.id}`}>
                      <div style={{ overflow: 'hidden' }}>
                        <h2>{board.name}</h2>
                        <Description>{board.description}</Description>
                        <Public public={board.public} />
                      </div>
                    </Link>
                  </Board>
                </Box>
              ))}
            </Flex>
          </Loader>
        </Box>
      </Content>
    )
  }
}

Boards.propTypes = {
  store: storePropTypes.isRequired
}

export default props => (
  <Consumer>{({ user }) => <Boards {...props} user={user} />}</Consumer>
)
