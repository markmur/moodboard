import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Flex, Box } from 'grid-styled';
import { Consumer } from '../auth';
import { db } from '../firebase';

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
        <h1>My Boards</h1>

        <Flex p={2}>
          {this.state.boards.map(board => (
            <Box
              key={board.id}
              width={1 / 3}
              p={2}
              style={{ border: '1px solid #ddd', background: 'white' }}
            >
              <Link to={`/boards/${board.id}`}>
                <h4>{board.name}</h4>
                <p>{board.description}</p>
              </Link>
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
