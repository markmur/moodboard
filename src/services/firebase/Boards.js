import { BOARDS, USERS, IMAGES } from '../constants'

export function getBoard(id) {
  return this.db.collection(BOARDS).doc(id)
}

export function getBoards(uid) {
  return this.db.collection(BOARDS).where(`members.${uid}`, '==', true)
}

export function getFollowingBoards(uid) {
  return this.db.collection(BOARDS).where(`followers.${uid}`, '==', true)
}

export function getImagesForBoard(id) {
  return this.db
    .collection(BOARDS)
    .doc(id)
    .collection(IMAGES)
}

export function getBoardMembers(members = []) {
  return Promise.all(
    members.map(id =>
      this.db
        .collection(USERS)
        .where(this.firebase.firestore.FieldPath.documentId(), '==', id)
        .get()
    )
  )
    .then(results => {
      return results.map(result => result.docs[0].data())
    })
    .catch(this.handleError('getBoardMembers'))
}

export function createBoard(uid, { name, description = '' }) {
  return this.db
    .collection(BOARDS)
    .add({
      name,
      description,
      createdBy: uid,
      createdAt: this.timestamp,
      updatedAt: this.timestamp,
      public: false,
      members: {
        [uid]: true
      }
    })
    .catch(this.handleError('createBoard'))
}

export function updateBoard(id, field, value) {
  return this.db
    .collection(BOARDS)
    .doc(id)
    .update({
      [field]: value,
      updatedAt: this.timestamp
    })
}

export function followBoard(id, uid) {
  return this.db
    .collection(BOARDS)
    .doc(id)
    .set(
      {
        followers: {
          [uid]: true
        }
      },
      { merge: true }
    )
}

export function unfollowBoard(id, uid) {
  return this.db
    .collection(BOARDS)
    .doc(id)
    .set(
      {
        followers: {
          [uid]: false
        }
      },
      { merge: true }
    )
}

export function deleteBoard(id) {
  return this.db
    .collection(BOARDS)
    .doc(id)
    .delete()
}
