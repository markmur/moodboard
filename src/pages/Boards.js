import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import { Trash } from '../icons';
import { Consumer } from '../AuthProvider';
import firebase, { db } from '../firebase';

import Button from '../components/Button';

const Board = styled(Flex).attrs({
  justify: 'space-between',
  align: 'center',
  p: 4
})`
  border: 1px solid ${p => p.theme.colors.gray};
  background: white;
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.05);
  ${p => p.theme.borderRadius};
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

  render() {
    return (
      <div>
        <Flex justify="space-between" align="center">
          <h3>My Boards</h3>
          <Button>
            <Link to="/boards/new">Create Board</Link>
          </Button>
        </Flex>

        <Flex flexWrap="wrap" py={4} mx={-3}>
          {this.state.boards.map(board => (
            <Box key={board.id} mb={3} mx={0} px={3} width={[1, 1 / 2, 1 / 3]}>
              <Board>
                <Link to={`/boards/${board.id}`}>
                  <h2>{board.name}</h2>
                  <Description>{board.description}</Description>
                </Link>

                <Trash onClick={() => firebase.deleteBoard(board.id)} />
              </Board>
            </Box>
          ))}
        </Flex>
      </div>
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
