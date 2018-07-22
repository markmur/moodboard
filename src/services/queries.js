import firebase from './firebase'
import { COLLECTION, DOC } from './constants'

export const queries = {
  boards: {
    get: uid => firebase.getBoards(uid),
    type: COLLECTION
  },
  following: {
    get: uid => firebase.getFollowingBoards(uid),
    type: COLLECTION
  },
  board: {
    get: (uid, id) => firebase.getBoard(id),
    type: DOC
  },
  images: {
    get: (uid, id) => firebase.getImagesForBoard(id),
    type: COLLECTION
  },
  comments: {
    get: (uid, id) => firebase.getCommentsForBoard(id),
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
