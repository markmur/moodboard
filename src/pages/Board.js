import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-rnd'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import AutosizeInput from 'react-input-autosize'
import { Flex, Box } from 'grid-styled'
import Switch from 'react-switch'
import firebase, { db, storage } from '../services/firebase'
import { Avatars, Content, Label } from '../styles'
import Button from '../components/Button'
import { storePropTypes, userPropTypes, historyPropTypes } from '../prop-types'
import { get } from '../services/utils'

const Overlay = styled.div.attrs({
  children: 'Drop files to upload'
})`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 3rem;
  padding: 2.5em 0;
  color: rgb(102, 51, 153);
  background: rgba(255, 255, 255, 0.4);
  text-align: center;
  border: 2em solid rgba(102, 51, 153, 0.3);
  z-index: 100;
`

const StyledDropzone = styled(Dropzone).attrs({
  activeClassName: 'active',
  disableClick: true
})`
  position: fixed;
  top: 267px;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;

  &.active {
    z-index: 100;
  }
`

const Header = styled.div`
  box-shadow: ${p => p.theme.shadow};
  padding: 0 0 3em;
  background: white;
`

const BoardContainer = styled.div`
  min-height: 300vh;
`

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
`

const BoardDescription = BoardName.extend`
  input {
    font-size: 1.45em;
    font-weight: normal;
    color: ${p => p.theme.colors.gray};
  }
`

const Image = styled.img.attrs({
  alt: '',
  draggable: false
})`
  border: ${p => (p.selected ? '2px solid blue' : '1px solid #ddd')};
`

const Caption = styled(AutosizeInput).attrs({
  style: {
    display: 'flex'
  }
})`
  justify-content: center;
  margin-top: 8px;

  input {
    display: block;
    outline: none;
    background: transparent;
    border: none;
    font-size: 15px;
    font-weight: bold;
    color: #7b81a2;
    text-align: center;
    width: 100%;
    left: 0;
    right: 0;
    font-style: italic;
    font-family: var(--font);
  }
`

class Board extends Component {
  static propTypes = {
    history: historyPropTypes.isRequired
  }

  state = {
    loading: true,
    selected: null,
    name: '',
    description: '',
    images: [],
    profiles: []
  }

  get boardId() {
    return this.props.match.params.id
  }

  componentDidMount() {
    const { store } = this.props

    store.subscribe('board', this.boardId, exists => {
      if (!exists) this.props.history.replace('/boards')

      store.subscribe('images', this.boardId)
    })
  }

  componentWillUnmount() {
    this.props.store.unsubscribe('board')
    this.props.store.unsubscribe('images')
  }

  getMembers(members) {
    firebase
      .getBoardMembers(members)
      .then(profiles => {
        this.setState({ profiles })
      })
      .catch(err => {
        console.log(err)
      })
  }

  onDrop = (acceptedFiles, rejectedFiles, event) => {
    this.props.store.setGlobalLoadingState(true)

    const { pageX, pageY } = event.target

    this.setState(({ images }) => ({
      images: [
        ...images,
        ...acceptedFiles.map(file => ({
          href: file.preview,
          position: {
            x: pageX,
            y: pageY
          }
        }))
      ]
    }))

    const uploads = acceptedFiles.map(file =>
      firebase
        .addImageToBoard(this.boardId, file, {
          name: file.name
        })
        .catch(err => {
          console.log(err)
          this.props.store.setGlobalLoadingState(false)
        })
    )

    Promise.all(uploads).then(() =>
      this.props.store.setGlobalLoadingState(false)
    )
  }

  handleDragEnd = imageId => (event, { x, y }) => {
    firebase.updateImagePosition(this.boardId, imageId, { x, y })
  }

  handleResize = imageId => (e, direction, ref) => {
    firebase.updateImageDimensions(this.boardId, imageId, {
      width: ref.style.width,
      height: ref.style.height
    })
  }

  updateBoard = (field, value) => {
    try {
      db.collection('boards')
        .doc(this.boardId)
        .update({
          [field]: value
        })
    } catch (err) {
      console.log('Error updating board name', { err })
    }
  }

  updateImage = (id, field, value) => {
    try {
      db.collection('boards')
        .doc(this.boardId)
        .collection('images')
        .doc(id)
        .update({
          [field]: value
        })
    } catch (err) {
      console.log('Error updating board name', { err })
    }
  }

  deleteImage = image => () => {
    try {
      // Delete image reference from board
      db.collection('boards')
        .doc(this.boardId)
        .collection('images')
        .doc(image.id)
        .delete()
      // Delete image from storage
      storage()
        .refFromURL(image.href)
        .delete()
    } catch (err) {
      console.error(err)
    }
  }

  following = (board, uid) =>
    board && board.followers && uid in board.followers && board.followers[uid]

  followBoard = () => {
    const { user } = this.props

    firebase.followBoard(this.boardId, user.uid)
  }

  handleBlur = field => () => {
    this.updateBoard(field, this.state[field])
  }

  handleChange = field => event => {
    const { value } = event.target

    if (value) {
      this.setState({
        [field]: value
      })
    }
  }

  handleCaptionClick = event => {
    event.stopPropagation()
    event.preventDefault()
    event.target.focus()
  }

  handleCaptionChange = (image = {}) => event => {
    if (image.caption !== event.target.value) {
      this.updateImage(image.id, 'caption', event.target.value)
    }
  }

  render() {
    const { store, user } = this.props

    const board = store.board.data
    const images = store.images.data

    return (
      <BoardContainer
        onClick={event => {
          const { classList } = event.target.parentNode

          if (!classList.contains('image') && !classList.contains('caption'))
            this.setState({ selected: null })
        }}
      >
        <Header>
          <Content>
            <Flex justify="space-between" align="center">
              <div>
                <BoardName
                  defaultValue={board.name}
                  placeholder={
                    store.board.loading ? 'Loading...' : 'Board Name'
                  }
                  onChange={this.handleChange('name')}
                  onBlur={this.handleBlur('name')}
                />

                <BoardDescription
                  placeholder={store.board.loading ? '' : 'No description'}
                  onChange={this.handleChange('description')}
                  onBlur={this.handleBlur('description')}
                  value={board.description}
                />
              </div>
              <Flex justify="space-between" align="center">
                <Box mr={4}>
                  <Avatars profiles={board.profiles} size={40} />
                </Box>
                <Box mr={3} width="70px">
                  <Label>Public</Label>
                  <Switch
                    height={23}
                    width={54}
                    disabled={board.createdBy !== user.uid}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    checked={Boolean(board.public)}
                    offColor="#ddd"
                    onColor="#0087ff"
                    onChange={val => this.updateBoard('public', Boolean(val))}
                  />
                </Box>
                {board.createdBy === user.uid ? (
                  <Button onClick={() => this.dropzone.open()}>
                    <a>Upload</a>
                  </Button>
                ) : (
                  <Button
                    onClick={this.followBoard}
                    type={this.following(board, user.uid) && 'success'}
                  >
                    <a>
                      {this.following(board, user.uid) ? 'Following' : 'Follow'}{' '}
                      Board
                    </a>
                  </Button>
                )}
              </Flex>
            </Flex>
          </Content>
        </Header>

        <StyledDropzone
          innerRef={c => {
            this.dropzone = c
          }}
          accept="image/*"
          style={{ position: 'fixed' }}
          onDrop={this.onDrop}
        >
          {({ isDragActive }) => (isDragActive ? <Overlay /> : null)}
        </StyledDropzone>

        <Content>
          {images.map(image => (
            <Draggable
              key={image.id}
              default={{
                x: image.position.x,
                y: image.position.y,
                width: get(image, 'dimensions.width', 400)
              }}
              lockAspectRatio
              onDragStop={this.handleDragEnd(image.id)}
              onResize={this.handleResize(image.id)}
              onClick={event => {
                if (event.target.tagName === 'IMG') {
                  this.setState({ selected: image.id })
                }
              }}
            >
              <div className="image" style={{ position: 'relative' }}>
                {this.state.selected === image.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '0',
                      display: 'flex',
                      width: '100%',
                      color: 'white',
                      fontSize: 12,
                      fontWeight: 'bold',
                      justifyContent: 'flex-end',
                      background: 'blue',
                      padding: '6px',
                      cursor: 'default'
                    }}
                  >
                    <a onClick={this.deleteImage(image)}>Delete</a>
                  </div>
                )}
                <Image
                  selected={this.state.selected === image.id}
                  src={image.href}
                />
                {image.caption || this.state.selected === image.id ? (
                  <Caption
                    className="caption"
                    onMouseDown={this.handleCaptionClick}
                    onBlur={this.handleCaptionChange(image)}
                    defaultValue={image.caption}
                    placeholder="Add caption..."
                  />
                ) : null}
              </div>
            </Draggable>
          ))}
        </Content>
      </BoardContainer>
    )
  }
}

Board.propTypes = {
  user: userPropTypes.isRequired,
  store: storePropTypes.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object
  }).isRequired
}

export default Board
