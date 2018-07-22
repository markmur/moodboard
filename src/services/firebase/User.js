import { USERS } from '../constants'

export function createOrUpdateUser({ uid, displayName, photoURL, email }) {
  console.log('createOrUpdateUser', { uid, displayName, photoURL, email })
  return this.db
    .collection(USERS)
    .doc(uid)
    .set({
      displayName,
      photoURL,
      email
    })
    .catch(this.handleError('createOrUpdateUser'))
}

export function getUserById(uid) {
  console.log(this, uid)
  return this.db.collection(USERS).doc(uid)
}
