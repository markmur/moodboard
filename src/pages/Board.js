import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Draggable from 'react-rnd';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import AutosizeInput from 'react-input-autosize';
import { Flex, Box } from 'grid-styled';
import firebase, { db } from '../firebase';
import { Avatar } from '../styles';
import Button from '../components/Button';

const StyledDropzone = styled(Dropzone)`
  position: fixed;
  top: 103px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
`;

const BoardContainer = styled.div`
  min-height: 300vh;
`;

const BoardName = styled(AutosizeInput).attrs({
  style: {
    display: 'block'
  }
})`
  input {
    display: block;
    background: transparent;
    border: none;
    font-size: 5rem;
    font-weight: bolder;
    outline: none;
  }
`;

const BoardDescription = BoardName.extend`
  input {
    font-size: 1.35em;
    font-weight: normal;
    color: ${p => p.theme.colors.gray};
  }
`;

const Caption = BoardName.extend`
  input {
    font-size: 15px;
    font-weight: normal;
    color: #555;
    text-align: center;
  }
`;

class Board extends Component {
  state = {
    loading: true,
    selected: {},
    name: '',
    description: '',
    images: [],
    profiles: []
  };

  get boardId() {
    return this.props.match.params.id;
  }

  componentDidMount() {
    const boardRef = db.collection('boards').doc(this.boardId);
    const imagesRef = db
      .collection('boards')
      .doc(this.boardId)
      .collection('images');

    boardRef.onSnapshot(snapshot => {
      const board = snapshot.data();

      if (!snapshot || !board) this.props.history.replace('/boards');

      this.getMembers(Object.keys(board.members));

      imagesRef.onSnapshot(images => {
        this.setState({
          loading: false,
          ...board,
          images: images.docs.map(x => x.data())
        });
      });
    });
  }

  getMembers(members) {
    firebase
      .getBoardMembers(members)
      .then(profiles => {
        this.setState({ profiles });
      })
      .catch(err => {
        console.log(err);
      });
  }

  onDrop = acceptedFiles => {
    this.setState(({ images }) => ({
      images: [
        ...images,
        ...acceptedFiles.map(file => ({
          href: file.preview,
          position: {
            x: 0,
            y: 0
          }
        }))
      ]
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

  updateBoard = (field, value) => {
    try {
      db.collection('boards')
        .doc(this.boardId)
        .update({
          [field]: value
        });
    } catch (err) {
      console.log('Error updating board name', { err });
    }
  };

  handleBlur = field => () => {
    this.updateBoard(field, this.state[field]);
  };

  handleChange = field => event => {
    const { value } = event.target;

    if (value) {
      this.setState({
        [field]: value
      });
    }
  };

  render() {
    return (
      <BoardContainer onClick={() => this.setState({ selected: {} })}>
        <Flex justify="space-between" align="center">
          <div>
            <BoardName
              defaultValue={this.state.name}
              placeholder={this.state.loading ? 'Loading...' : 'Board Name'}
              onChange={this.handleChange('name')}
              onBlur={this.handleBlur('name')}
            />

            <BoardDescription
              placeholder={this.state.loading ? '' : 'No description'}
              onChange={this.handleChange('description')}
              onBlur={this.handleBlur('description')}
              value={this.state.description}
            />
          </div>
          <Flex justify="space-between" align="center">
            <div>
              {this.state.profiles.map(user => (
                <Avatar key={user.email} size={50} src={user.photoURL} />
              ))}
            </div>
            <Button>Share</Button>
          </Flex>
        </Flex>

        <StyledDropzone
          disableClick
          onDrop={this.onDrop}
          style={{ position: 'fixed' }}
          activeStyle={{
            border: '5em solid rgba(102, 51, 153, 0.3)'
          }}
        />

        {this.state.images.map(image => (
          <Draggable
            key={image.id}
            lockAspectRatio
            default={{ x: image.position.x, y: image.position.y, width: 400 }}
            onDragStop={this.handleDragEnd(image.id)}
          >
            <img
              style={{
                border:
                  this.state.selected.id === image.id
                    ? '2px solid blue'
                    : '1px solid #ddd'
              }}
              onClick={() => {
                this.setState({
                  selected: image
                });
              }}
              draggable="false"
              src={image.href}
            />
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
