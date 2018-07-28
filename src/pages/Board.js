import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-rnd'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'
import AutosizeInput from 'react-input-autosize'
import { Flex, Box } from 'grid-styled'
import memoize from 'memoize-one'
import Switch from 'react-switch'
import pluralize from 'pluralize'
import { without } from 'lodash-es'
import Textarea from 'react-textarea-autosize'
import firebase from '../services/firebase'
import { Avatars, Content, Label } from '../styles'
import Button from '../components/Button'
import Loader from '../components/SmallLoader'
import CommentsPanel from '../components/CommentsPanel/CommentsPanel'
import { storePropTypes, userPropTypes, historyPropTypes } from '../prop-types'
import {
  get,
  getImageDimensions,
  calculateDimensions,
  DEFAULT_WIDTH
} from '../services/utils'

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
    color: black;
    display: block;
    background: transparent;
    border: none;
    font-size: 5rem;
    font-weight: bolder;
    outline: none;
  }
`

const BoardDescription = styled(Textarea)`
  color: black;
  display: block;
  background: transparent;
  border: none;
  font-size: 5rem;
  font-weight: bolder;
  outline: none;
  font-size: 1.45em;
  font-weight: normal;
  color: ${p => p.theme.colors.gray};
  resize: none;
  width: 100%;
`

const Image = styled.img.attrs({
  alt: '',
  draggable: false
})`
  border: ${p => (p.selected ? '2px solid blue' : '1px solid transparent')};
`

const ImageToolbar = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  width: 100%;
  color: white;
  font-size: 12px;
  font-weight: bold;
  justify-content: flex-end;
  background: blue;
  padding: 6px;
  cursor: default;

  a {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
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
    selected: [],
    name: '',
    description: '',
    images: [],
    commentsPanelOpen: false
  }

  get boardId() {
    return this.props.match.params.id
  }

  componentDidMount() {
    const { store } = this.props

    store.subscribe('board', this.boardId, board => {
      if (!board) this.props.history.replace('/boards')

      store.subscribe('images', this.boardId)
      store.subscribe('comments', this.boardId)
    })
  }

  componentWillUnmount() {
    this.props.store.unsubscribe('board')
    this.props.store.unsubscribe('images')
  }

  static getDerivedStateFromProps(props, state) {
    const { name, description } = get(props, 'store.board.data', {})

    if (!state.name || !state.description) {
      return {
        name,
        description
      }
    }

    if (
      name &&
      description &&
      (state.name !== name || state.description !== description)
    ) {
      return {
        name: state.name,
        description: state.description
      }
    }

    return null
  }

  onDrop = async (acceptedFiles, rejectedFiles, event) => {
    this.props.store.setGlobalLoadingState(true)

    event.persist()

    const { pageX, pageY } = event

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

    Promise.all(
      acceptedFiles.map(
        file =>
          new Promise((resolve, reject) =>
            getImageDimensions(file.preview)
              .then(calculateDimensions)
              .then(({ width, height }) =>
                firebase
                  .addImageToBoard(this.boardId, file, {
                    name: file.name,
                    width,
                    height,
                    x: pageX,
                    y: pageY - height
                  })
                  .catch(reject)
              )
          )
      )
    )
      .then(() => {
        this.props.store.setGlobalLoadingState(false)
      })
      .catch(() => {
        this.props.store.setGlobalLoadingState(false)
      })
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

  updateBoard = async (field, value) => {
    if (!field) {
      return Promise.reject(new Error(`'field' ${field} is not a valid field`))
    }

    if (value === null || typeof value === 'undefined') {
      return Promise.reject(
        new Error(`'value' ${value} should not be null or undefined`)
      )
    }

    try {
      await firebase.updateBoard(this.boardId, field, value)
    } catch (err) {
      console.log(`Error updating ${field}: ${value}`, { err })
    }
  }

  updateImage = async (id, field, value) => {
    try {
      await firebase.updateImage(this.boardId, id, field, value)
    } catch (err) {
      console.log('Error updating board name', { err })
    }
  }

  deleteImage = image => async () => {
    try {
      await firebase.deleteImage(this.boardId, image)
    } catch (err) {
      console.error(err)
    }
  }

  following = (board, uid) =>
    board && board.followers && uid in board.followers && board.followers[uid]

  followBoard = () => {
    const { user, store } = this.props

    const following = get(store.board.data, 'followers', {})[user.uid]

    return firebase[following ? 'unfollowBoard' : 'followBoard'](
      this.boardId,
      user.uid
    )
  }

  handleBlur = field => () => {
    const board = this.props.store.board.data

    if (this.state[field] !== board[field]) {
      this.updateBoard(field, this.state[field])
    }
  }

  handleChange = field => event => {
    const { value } = event.target

    if (!field || value.length <= 0) return

    this.setState({
      [field]: value
    })
  }

  getImageById = id => {
    return get(this.props.store, 'images.data', []).find(x => x.id === id)
  }

  bindKeyboardShortcuts = event => {
    // Ignore keypresses when no image is selected
    if (!this.state.selected) return

    switch (event.key) {
      case 'Backspace':
        if (this.state.selected && this.state.selected.length > 0) {
          this.state.selected.forEach(selected => {
            this.deleteImage(this.getImageById(selected))()
          })
        }
        break
      default:
        break
    }
  }

  handleCaptionClick = event => {
    if (!this.userHasPermission(this.props)) return

    event.stopPropagation()
    event.preventDefault()
    event.target.focus()
  }

  userHasPermission = memoize(props => {
    const { store, user } = props
    const { uid } = user

    const board = store.board.data

    return get(board, 'createdBy') === uid || get(board, 'members', [])[uid]
  })

  handleCaptionChange = (image = {}) => event => {
    if (image.caption !== event.target.value) {
      this.updateImage(image.id, 'caption', event.target.value)
    }
  }

  selectImage = image => event => {
    const { uid } = this.props.user
    const board = this.props.store.board.data

    const { metaKey } = event

    if (event.target.tagName === 'IMG' && board.createdBy === uid) {
      // If the cmd/ctrl key is held, append the image
      this.setState(({ selected }) => ({
        selected: metaKey
          ? this.selected(image.id)
            ? without(selected, image.id)
            : [...selected, image.id]
          : [image.id]
      }))
    }
  }

  selected = id => this.state.selected.includes(id)

  createComment = form => {
    const { user, store } = this.props

    if (!form.comment) return

    const message = form.comment.value.trim()

    if (!message || message.length <= 0) return

    firebase.createComment({
      imageId: store.images.data[0].id,
      boardId: this.boardId,
      message,
      from: {
        uid: user.uid,
        name: user.displayName,
        photoURL: user.photoURL
      }
    })
  }

  render() {
    const { store, user } = this.props

    const board = store.board.data
    const images = store.images.data
    const userHasPermission = this.userHasPermission(this.props)

    return (
      <BoardContainer
        onClick={event => {
          const { classList } = event.target.parentNode

          if (!classList.contains('image') && !classList.contains('caption'))
            this.setState({ selected: [] })
        }}
      >
        {userHasPermission && (
          <CommentsPanel
            visible={this.state.commentsPanelOpen}
            user={user}
            loading={store.comments.loading}
            comments={store.comments.data}
            onCreateComment={this.createComment}
            onClose={() =>
              this.setState({
                commentsPanelOpen: false
              })
            }
          />
        )}

        <Header>
          <Content>
            <Flex justify="space-between" align="center">
              <div>
                <BoardName
                  disabled={!userHasPermission}
                  defaultValue={board.name}
                  placeholder={
                    store.board.loading ? 'Loading...' : 'Board Name'
                  }
                  onChange={this.handleChange('name')}
                  onBlur={this.handleBlur('name')}
                />

                <BoardDescription
                  disabled={!userHasPermission}
                  placeholder={store.board.loading ? '' : 'No description'}
                  onChange={this.handleChange('description')}
                  onBlur={this.handleBlur('description')}
                  value={this.state.description}
                />
              </div>
              <Flex justify="space-between" align="center">
                <Box mr={4}>
                  <Avatars profiles={board.profiles} size={40} />
                </Box>

                <Flex
                  mr={3}
                  width="70px"
                  alignItems="center"
                  flexDirection="column"
                >
                  <Label>Followers</Label>
                  <h2>
                    {
                      Object.values(get(board, 'followers', {})).filter(x => x)
                        .length
                    }
                  </h2>
                </Flex>

                <Box mr={3} width="70px">
                  <Label>Public</Label>
                  <Box mb={2}>
                    <Switch
                      height={23}
                      width={54}
                      disabled={!userHasPermission}
                      uncheckedIcon={false}
                      checkedIcon={false}
                      checked={Boolean(board.public)}
                      offColor="#ddd"
                      onColor="#0087ff"
                      onChange={val => this.updateBoard('public', Boolean(val))}
                    />
                  </Box>
                </Box>

                {userHasPermission && (
                  <Button
                    mr={2}
                    onClick={() =>
                      this.setState({
                        commentsPanelOpen: true
                      })
                    }
                  >
                    {pluralize('Comment', store.comments.data.length, true)}
                  </Button>
                )}

                {userHasPermission ? (
                  <Button onClick={() => this.dropzone.open()}>Upload</Button>
                ) : (
                  <Button
                    hoverText={this.following(board, user.uid) && 'Unfollow'}
                    onClick={this.followBoard}
                    type={this.following(board, user.uid) && 'success'}
                  >
                    {this.following(board, user.uid) ? 'Following' : 'Follow'}
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

        <Content tabIndex="0" onKeyDown={this.bindKeyboardShortcuts}>
          <Loader loading={store.images.loading}>
            {images.map(image => (
              <Draggable
                key={image.id}
                default={{
                  x: image.position.x,
                  y: image.position.y,
                  width: get(image, 'dimensions.width', DEFAULT_WIDTH)
                }}
                disableDragging={!userHasPermission}
                lockAspectRatio
                onDragStop={this.handleDragEnd(image.id)}
                onResize={this.handleResize(image.id)}
                onClick={this.selectImage(image)}
              >
                <div className="image" style={{ position: 'relative' }}>
                  {this.selected(image.id) && (
                    <ImageToolbar>
                      <a onClick={this.deleteImage(image)}>Delete</a>
                    </ImageToolbar>
                  )}
                  <Image selected={this.selected(image.id)} src={image.href} />
                  {image.caption || this.selected(image.id) ? (
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
          </Loader>
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
