import { db } from './firebase'

export const COLLECTION = 'collection'
export const DOC = 'doc'

export const queries = {
  boards: {
    get: uid => db.collection('boards').where(`members.${uid}`, '==', true),
    type: COLLECTION
  },
  following: {
    get: uid => db.collection('boards').where(`followers.${uid}`, '==', true),
    type: COLLECTION
  },
  board: {
    get: (uid, id) => db.collection('boards').doc(id),
    type: DOC
  },
  images: {
    get: (uid, id) =>
      db
        .collection('boards')
        .doc(id)
        .collection('images'),
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
