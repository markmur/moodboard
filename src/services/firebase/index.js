import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import { firebaseConfig } from '../config'

import * as Auth from './Auth'
import * as Boards from './Boards'
import * as Comments from './Comments'
import * as User from './User'
import * as Images from './Images'

let app

if (firebase.apps.length <= 0) {
  app = firebase.initializeApp(firebaseConfig)
}

function FirebaseClient(fb) {
  const { firestore, storage, auth } = fb

  this.firebase = fb
  this.db = firestore(app)
  this.db.settings({ timestampsInSnapshots: true })
  this.storage = storage()
  this.auth = auth
  this.timestamp = firestore.FieldValue.serverTimestamp()
  this.handleError = name => error => {
    console.log(name, error)
  }
  this.documentId = firebase.firestore.FieldPath
}

const extend = (obj, fns) => {
  for (const name in fns) {
    if (Object.prototype.hasOwnProperty.call(fns, name)) {
      Object.getPrototypeOf(obj)[name] = fns[name].bind(obj)
    }
  }
}

const client = new FirebaseClient(firebase)

console.log(client, client.prototype)

extend(client, Object.assign({}, Auth, Boards, Comments, Images, User))

export default client
