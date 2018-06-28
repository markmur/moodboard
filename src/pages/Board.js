import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-rnd';
import Dropzone from 'react-dropzone';
import firebase, { db } from '../firebase';

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

  render() {
    return (
      <div>
        <h1>Moodboard</h1>
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
      </div>
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
