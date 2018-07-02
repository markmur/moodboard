import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import { Trash } from '../icons';
import { Consumer } from '../AuthProvider';
import firebase, { db } from '../firebase';
import { Content } from '../styles';
import BoardIcon from '../icons/board';

import Button from '../components/Button';

const Board = styled(Flex)`
  border: 1px solid ${p => p.theme.colors.gray};
  background: white;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.05);
  ${p => p.theme.borderRadius};

  a {
    padding: 2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
`;

const Description = styled.p`
  color: ${p => p.theme.colors.gray};
`;

class Boards extends Component {
  state = {
    boards: []
  };

  componentDidMount() {
    this.unsubscribe = db
      .collection('boards')
      .where(`members.${this.props.user.uid}`, '==', true)
      .onSnapshot(this.setBoardsToState);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  setBoardsToState = snapshot =>
    this.setState({
      boards: snapshot.docs.map(x => ({
        ...x.data(),
        id: x.id
      }))
    });

  handleBoardDelete = boardId => event => {
    event.preventDefault();

    firebase.deleteBoard(boardId);
  };

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
        <Button>
          <Link to="/boards/new">Create Board</Link>
        </Button>
      </Flex>
    );
  }

  render() {
    return (
      <Content minHeight pt={4} bg="white">
        <Flex justify="space-between" align="center">
          <h2>My Boards</h2>
          <Button>
            <Link to="/boards/new">Create Board</Link>
          </Button>
        </Flex>

        {this.state.boards.length > 0 ? (
          <Flex flexWrap="wrap" py={3} mx={-3}>
            {this.state.boards.map(board => (
              <Box
                key={board.id}
                mb={3}
                mx={0}
                px={3}
                width={[1, 1 / 2, 1 / 3]}
              >
                <Board>
                  <Link to={`/boards/${board.id}`}>
                    <div>
                      <h2>{board.name}</h2>
                      <Description>{board.description}</Description>
                    </div>

                    <Trash onClick={this.handleBoardDelete(board.id)} />
                  </Link>
                </Board>
              </Box>
            ))}
          </Flex>
        ) : (
          this.renderEmptyState()
        )}
      </Content>
    );
  }
}

Boards.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string
  }).isRequired
};

export default props => (
  <Consumer>{({ user }) => <Boards {...props} user={user} />}</Consumer>
);
