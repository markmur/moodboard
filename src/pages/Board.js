import React, { Component } from 'react';
import Draggable from 'react-rnd';
import Dropzone from 'react-dropzone';

class Board extends Component {
  state = {
    images: []
  };

  onDrop = acceptedFiles => {
    console.log(acceptedFiles);
    this.setState(({ images }) => ({
      images: [...images, ...acceptedFiles.map(file => file.preview)]
    }));
  };

  render() {
    return (
      <div>
        <h1>Moodboard</h1>
        <Dropzone onDrop={this.onDrop} />
        {this.state.images.map(image => (
          <Draggable
            key={image}
            lockAspectRatio
            default={{ x: 0, y: 0, width: 400 }}
            style={{
              border: 'solid 1px #ddd'
            }}
          >
            <img draggable="false" src={image} />
          </Draggable>
        ))}
      </div>
    );
  }
}

export default Board;
