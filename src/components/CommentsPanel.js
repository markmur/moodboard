import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Flex, Box } from 'grid-styled'
import firebase from '../services/firebase'
import { Avatar } from '../styles'
import { get } from '../services/utils'
import { SubmitButton } from './Button'

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  width: 400px;
  height: 100vh;
  right: 0;
  top: 0;
  background: white;
  z-index: 10;
  box-shadow: -10px 0 20px 0 rgba(0, 0, 2, 0.075);
  transform: translateX(${p => (p.visible ? 0 : '100%')});
  transition: transform 200ms ease-out;

  header {
    padding: 1.5em 2.5em;
  }

  main {
    background: #f4f4f7;
    padding: 1.5em 0.5em;
    flex: 1;
    overflow: scroll;
  }

  footer {
    padding: 1em;

    form {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }

    input[type='text'] {
      width: 100%;
      background: #f4f4f7;
      border: 1px solid #eee;
      font-size: 16px;
      border-radius: 4px;
      padding: 0.7em;
      margin-right: 0.5em;
    }
  }
`

const Message = styled(({ comment, align, className, showUser }) => {
  const right = align === 'right'
  const margin = {
    mr: !right && 2,
    ml: right && 2
  }

  const deleteButton = (
    <a type="button">
      <strong onClick={() => firebase.deleteComment(comment.id)}>Delete</strong>
    </a>
  )

  return (
    <li className={className}>
      <Flex flexDirection={right ? 'row-reverse' : 'row'}>
        {showUser && (
          <Box {...margin} mt="18px">
            <Avatar size={30} src={comment.from.photoURL} />
          </Box>
        )}
        <div>
          {typeof comment.from === 'object' && showUser ? (
            <strong>{comment.from.name}</strong>
          ) : null}
          <p>{comment.message}</p>
          {deleteButton}
        </div>
      </Flex>
    </li>
  )
})`
  strong,
  small {
    display: block;
    color: #8396c3;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    font-size: 12px;
    text-align: ${p => (p.align === 'right' ? 'right' : 'left')};
  }

  a > strong {
    cursor: pointer;
  }

  a {
    display: none;
  }

  p {
    padding: 6px 8px 8px;
    background: ${p => (p.primary ? 'blue' : 'white')};
    color: ${p => (p.primary ? 'white' : 'black')};
    -webkit-font-smoothing: subpixel-antialiased;
    font-size: 14px;
    border-radius: 4px;
    box-shadow: ${p => p.theme.boxShadow};
    max-width: 250px;
    margin-bottom: 5px;
    margin-right: ${p => (p.showUser ? 0 : 38)}px;
    margin-left: ${p => (p.showUser ? 0 : 38)}px;
  }
`

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

  render() {
    const { user, comments } = this.props

    return (
      <Sidebar visible={this.props.visible}>
        <header>
          <h1 onClick={this.props.onClose}>Comments</h1>
          <p>
            Leave comments on an image to talk to other members or leave notes
            for yourself 😸
          </p>
        </header>

        <main>
          <ul>
            {comments.map((comment, i) => (
              <Message
                key={comment.id}
                primary={get(comment, 'from.uid') === user.uid}
                showUser={this.showUser(user.uid, comments[i - 1], comment)}
                align={comment.from.uid === user.uid ? 'right' : 'left'}
                comment={comment}
              />
            ))}
          </ul>
        </main>

        <footer>
          <form
            ref={c => {
              this.form = c
            }}
            autoComplete="off"
            autofill="off"
            onSubmit={this.props.onCreateComment}
          >
            <input name="comment" type="text" placeholder="Your message..." />
            <SubmitButton value="Send" />
          </form>
        </footer>
      </Sidebar>
    )
  }
}

export default CommentsPanel
