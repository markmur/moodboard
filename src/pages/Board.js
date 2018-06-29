import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-rnd';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import firebase, { db } from '../firebase';

const BoardContainer = styled.div`
  min-height: 300vh;
`;

const BoardName = styled.input``;

class Board extends Component {
  state = {
    board: {
      images: []
    }
  };

  get boardId() {
    return this.props.match.params.id;
  }

  async componentDidMount() {
    firebase.getBoard(this.boardId);

    const boardRef = db.collection('boards').doc(this.boardId);
    const imagesRef = db
      .collection('boards')
      .doc(this.boardId)
      .collection('images');

    const boardSnapshot = await boardRef.get();
    const imagesSnapshot = await imagesRef.get();

    const board = boardSnapshot.data();
    const images = imagesSnapshot.docs.map(x => x.data());

    if (!board) this.props.history.replace('/boards');

    this.setState({
      board: { ...board, images }
    });
  }

  onDrop = acceptedFiles => {
    this.setState(({ images }) => ({
      images: [...images, ...acceptedFiles.map(file => file.preview)]
    }));

    acceptedFiles.map(file =>
      firebase.addImageToBoard(this.boardId, file, {
        name: file.name
      })
    );
  };

  handleDragEnd = imageId => (event, { x, y }) => {
    firebase.updateImagePosition(this.boardId, imageId, { x, y });
  };

  updateBoardName = newName => {
    try {
      db.collection('boards')
        .doc(this.boardId)
        .update({
          name: newName
        });
    } catch (err) {
      console.log('Error updating board name', { err });
    }
  };

  handleBoardNameBlur = () => {
    this.updateBoardName(this.state.board.name);
  };

  handleBoardNameChange = event => {
    if (event.target.value) {
      this.setState(({ board }) => ({
        ...board,
        name: event.target.value
      }));
    }
  };

  render() {
    return (
      <BoardContainer>
        <BoardName
          value={this.state.board.name}
          placeholder="Board Name"
          onChange={this.handleBoardNameChange}
          onBlur={this.handleBoardNameBlur}
        />

        <Dropzone onDrop={this.onDrop} />
        {this.state.board.images.map(image => (
          <Draggable
            key={image.id}
            lockAspectRatio
            default={{ x: image.position.x, y: image.position.y, width: 400 }}
            style={{
              border: 'solid 1px #ddd'
            }}
            onDragStop={this.handleDragEnd(image.id)}
          >
            <img draggable="false" src={image.href} />
          </Draggable>
        ))}
      </BoardContainer>
    );
  }
}

Board.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.object
  }).isRequired
};

export default Board;
