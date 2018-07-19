import { db } from './firebase'

export const COLLECTION = 'collection'
export const DOC = 'doc'

const BOARDS = 'boards'
const IMAGES = 'images'
const COMMENTS = 'comments'

export const queries = {
  boards: {
    get: uid => db.collection(BOARDS).where(`members.${uid}`, '==', true),
    type: COLLECTION
  },
  following: {
    get: uid => db.collection(BOARDS).where(`followers.${uid}`, '==', true),
    type: COLLECTION
  },
  board: {
    get: (uid, id) => db.collection(BOARDS).doc(id),
    type: DOC
  },
  images: {
    get: (uid, id) =>
      db
        .collection(BOARDS)
        .doc(id)
        .collection(IMAGES),
    type: COLLECTION
  },
  comments: {
    get: (uid, id) =>
      db
        .collection(BOARDS)
        .doc(id)
        .collection(COMMENTS),
    type: COLLECTION
  }
}

export const setDefaultState = (key, type) => ({
  [key]: {
    loading: false,
    hasData: false,
    data: type === COLLECTION ? [] : {}
  }
})
