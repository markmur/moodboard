import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box } from 'grid-styled'
import { Consumer } from '../context/Auth'
import firebase from '../services/firebase'
import {
  Content,
  Container,
  Label,
  Error,
  Input,
  SubmitButton,
  Textarea
} from '../styles'

class NewBoard extends Component {
  state = {
    errors: {}
  }

  handleSubmit = event => {
    event.preventDefault()

    const name = event.target.name.value
    const description = event.target.description.value

    const board = {
      name,
      description
    }

    if (this.validate(board)) this.create(board)
  }

  validate(board = {}) {
    let valid = true
    const errors = {}

    if (!board.name) {
      errors.name = 'Name is required'
      valid = false
    }

    this.setState({ errors })

    return valid
  }

  async create(board) {
    console.log('Creating new board...', { board })
    firebase
      .createBoard(this.props.userId, board)
      .then(newBoard => {
        console.log({ newBoard })
        console.log(`Redirecting to /boards/${newBoard.id}`, this.props)
        this.props.history.replace(`/boards/${newBoard.id}`)
      })
      .catch(err => {
        this.setState(({ errors }) => ({
          ...errors,
          global: err
        }))
      })
  }

  renderErrorMessage = field => {
    const error = this.state.errors[field]
    return error && <Error>{error}</Error>
  }

  render() {
    return (
      <Content minHeight bg="white">
        <Container py={5} width={500}>
          <Box mb={4}>
            <h1>Create New Board</h1>
          </Box>

          {this.renderErrorMessage('global')}

          <form autoComplete="off" onSubmit={this.handleSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              {this.renderErrorMessage('name')}
              <Input name="name" type="text" placeholder="Board Name" />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              {this.renderErrorMessage('description')}
              <Textarea
                name="description"
                type="text"
                placeholder="Description"
              />
            </div>

            <SubmitButton type="submit" value="Create Board" />
          </form>
        </Container>
      </Content>
    )
  }
}

NewBoard.propTypes = {
  userId: PropTypes.string.isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func
  }).isRequired
}

export default props => (
  <Consumer>{({ user }) => <NewBoard userId={user.uid} {...props} />}</Consumer>
)
