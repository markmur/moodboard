import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const USERS = 'users';
const BOARDS = 'boards';
const IMAGES = 'images';

const config = {
  apiKey: 'AIzaSyCWRkSFhOVTfGxe4eT_IcvmYFIyMQmn9tA',
  authDomain: 'moodboard-b788b.firebaseapp.com',
  databaseURL: 'https://moodboard-b788b.firebaseio.com',
  projectId: 'moodboard-b788b',
  storageBucket: 'moodboard-b788b.appspot.com',
  messagingSenderId: '58231872924'
};

let app;

if (firebase.apps.length <= 0) {
  app = firebase.initializeApp(config);
}

const { auth, storage } = firebase;
const db = firebase.firestore(app);
db.settings({ timestampsInSnapshots: true });

window.db = db;

const handleError = name => error => {
  console.log(name, error);
};

class FirebaseClient {
  logout() {
    return auth().signOut();
  }

  createOrUpdateUser({ uid, displayName, photoURL, email }) {
    return db
      .collection(USERS)
      .doc(uid)
      .set({
        displayName,
        photoURL,
        email
      })
      .catch(handleError('createOrUpdateUser'));
  }

  getBoardMembers(members = []) {
    return Promise.all(
      members.map(id =>
        db
          .collection(USERS)
          .where(firebase.firestore.FieldPath.documentId(), '==', id)
          .get()
      )
    )
      .then(results => {
        return results.map(result => result.docs[0].data());
      })
      .catch(handleError('getBoardMembers'));
  }

  createBoard(uid, { name, description = '' }) {
    return db
      .collection(BOARDS)
      .add({
        name,
        description,
        createdBy: uid,
        public: false,
        members: {
          [uid]: true
        }
      })
      .catch(handleError('createBoard'));
  }

  updateBoad(id, field, value) {
    return db
      .collection(BOARDS)
      .doc(id)
      .update({
        [field]: value
      });
  }

  deleteBoard(id) {
    return db
      .collection(BOARDS)
      .doc(id)
      .delete();
  }

  getBoard(id) {
    return db
      .collection(BOARDS)
      .get(id)
      .catch(handleError('getBoard'));
  }

  uploadImage(blob, meta) {
    return storage().put(blob, meta);
  }

  handleImageUploadError(error) {
    console.error(error);
  }

  handleUploadProgress(snapshot) {
    const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log(percent + '% done');
  }

  addImageToBoard(boardId, file, { name }) {
    const url = `images/${name}`;
    const ref = storage().ref(url);
    const upload = ref.put(file);

    upload.on(firebase.storage.TaskEvent.STATE_CHANGED, {
      next: this.handleUploadProgress,
      error: this.handleImageUploadError,
      complete: async () => {
        const referenceUrl = await ref.getDownloadURL();

        const newReference = db
          .collection(BOARDS)
          .doc(boardId)
          .collection(IMAGES)
          .doc();

        newReference.set({
          id: newReference.id,
          name,
          href: referenceUrl,
          position: {
            x: 0,
            y: 0
          }
        });
      }
    });
  }

  removeImageFromBoard(boardId, imageId) {
    return db
      .collection(`${BOARDS}/${boardId}/${IMAGES}`)
      .doc(imageId)
      .delete()
      .catch(handleError('removeImageFromBoard'));
  }

  updateImagePosition(boardId, imageId, { x, y }) {
    return db
      .collection(`${BOARDS}/${boardId}/${IMAGES}`)
      .doc(imageId)
      .update({
        position: {
          x,
          y
        }
      })
      .catch(handleError('updateImagePosition'));
  }
}

const fb = new FirebaseClient();

export default fb;

export { auth, db };
