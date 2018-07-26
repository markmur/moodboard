import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get } from '../../services/utils'
import { SubmitButton } from '../Button'
import SlidePanel from '../SlidePanel'
import Message from './Message'

import { StyledTextarea, Header, Main, Footer } from './styles'

class CommentsPanel extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    comments: PropTypes.array,
    onCreateComment: PropTypes.func,
    onClose: PropTypes.func,
    user: PropTypes.shape({
      uid: PropTypes.string
    }).isRequired
  }

  static defaultProps = {
    visible: false,
    comments: [],
    onCreateComment() {},
    onClose() {}
  }

  showUser(uid, prev, next) {
    if (!prev) return true

    return get(prev, 'from.uid') !== get(next, 'from.uid')
  }

  handleFormSubmit = async event => {
    event.preventDefault()
    await this.props.onCreateComment(this.form)
    this.textarea.value = ''
  }

  render() {
    const { user, comments } = this.props

    return (
      <SlidePanel visible={this.props.visible}>
        <Header>
          <h1 onClick={this.props.onClose}>Comments</h1>
          <p>
            Leave comments on an image to talk to other members or leave notes
            for yourself{' '}
            <span role="img" aria-label="emoji">
              😸
            </span>
          </p>
        </Header>

        <Main>
          <ul>
            {comments.map((comment, i) => (
              <Message
                key={comment.id}
                primary={get(comment, 'from.uid') === user.uid}
                showUser={this.showUser(user.uid, comments[i - 1], comment)}
                canDelete={comment.from.uid === user.uid}
                align={comment.from.uid === user.uid ? 'right' : 'left'}
                comment={comment}
              />
            ))}
          </ul>
        </Main>

        <Footer>
          <form
            ref={c => {
              this.form = c
            }}
            autoComplete="off"
            autofill="off"
            onSubmit={this.handleFormSubmit}
          >
            <StyledTextarea
              name="comment"
              inputRef={c => {
                this.textarea = c
              }}
              placeholder="Your message..."
              onKeyPress={event => {
                if (event.key === 'Enter') this.handleFormSubmit(event)
              }}
            />
            <SubmitButton value="Send" />
          </form>
        </Footer>
      </SlidePanel>
    )
  }
}

export default CommentsPanel
