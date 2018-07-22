import { COMMENTS } from '../constants'

export function getCommentsForBoard(id) {
  return this.db
    .collection(COMMENTS)
    .where('boardId', '==', id)
    .orderBy('createdAt', 'asc')
}

export function createComment({ boardId, message, from }) {
  return this.db.collection(COMMENTS).add({
    boardId,
    message,
    from,
    createdAt: this.timestamp,
    updatedAt: this.timestamp
  })
}

export function updateComment(commentId, { message }) {
  return this.db
    .collection(COMMENTS)
    .doc(commentId)
    .update({
      message,
      updatedAt: this.timestamp
    })
}

export function deleteComment(commentId) {
  return this.db
    .collection(COMMENTS)
    .doc(commentId)
    .delete()
}
