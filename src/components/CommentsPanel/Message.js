import React from 'react'
import styled from 'styled-components'
import { Flex, Box } from 'grid-styled'
import firebase from '../../services/firebase'
import { Avatar } from '../../styles'

const Message = styled(({ comment, align, className, showUser, canDelete }) => {
  const right = align === 'right'
  const margin = {
    mr: !right && 2,
    ml: right && 2
  }

  const deleteButton = canDelete && (
    <div>
      <a type="button">
        <strong onClick={() => firebase.deleteComment(comment.id)}>
          Delete
        </strong>
      </a>
    </div>
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
  &:hover a {
    display: block;
  }

  strong,
  small {
    display: block;
    color: ${p => p.theme.colors.gray};
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

export default Message
