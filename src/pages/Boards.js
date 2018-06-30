import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Flex, Box } from 'grid-styled';
import { Consumer } from '../AuthProvider';
import firebase, { db } from '../firebase';

import Button from '../components/Button';

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
          <h3>My Boards ({this.state.boards.length})</h3>
          <Button>
            <Link to="/boards/new">New Board</Link>
          </Button>
        </Flex>

        <Flex flexWrap="wrap" py={4}>
          {this.state.boards.map(board => (
            <Box key={board.id} width={[1, 1 / 2, 1 / 3]} p={2}>
              <Box
                p={4}
                style={{
                  border: '1px solid #ddd',
                  background: 'white',
                  borderRadius: 3
                }}
              >
                <Link to={`/boards/${board.id}`}>
                  <h2>{board.name}</h2>
                  <p>{board.description}</p>
                </Link>

                <button
                  type="button"
                  onClick={() => firebase.deleteBoard(board.id)}
                >
                  Delete
                </button>
              </Box>
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
