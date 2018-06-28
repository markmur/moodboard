import firebase from 'firebase/app';
import ow from 'ow';
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
const provider = new firebase.auth.GoogleAuthProvider();

const validateStringArgsExist = (args = []) => {
  return args.map(arg => ow(arg, ow.string.nonEmpty));
};

window.db = db;

class FirebaseClient {
  login() {
    return auth()
      .signInWithRedirect(provider)
      .then(result => {
        const { user } = result;

        this.createOrUpdateUser(user);
      })
      .catch(error => {
        const { code, message, email, credential } = error;

        console.error({ code, message, email, credential });
      });
  }

  logout() {
    return auth().signOut();
  }

  createOrUpdateUser({ uid, displayName, photoURL, email }) {
    validateStringArgsExist([uid, displayName, email]);

    return db
      .collection(USERS)
      .doc(uid)
      .set({
        displayName,
        photoURL,
        email
      });
  }

  createBoard({ name, uid, description = '' }) {
    validateStringArgsExist([name, uid]);

    return db.collection(BOARDS).add({
      name,
      description,
      createdBy: uid,
      members: {
        [uid]: true
      }
    });
  }

  getBoard(id) {
    return db.collection(BOARDS).get(id);
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
        console.log({ referenceUrl });

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

  updateImagePosition(boardId, imageId, { x, y }) {
    return db
      .collection(`${BOARDS}/${boardId}/${IMAGES}`)
      .doc(imageId)
      .update({
        position: {
          x,
          y
        }
      });
  }
}

const fb = new FirebaseClient();

export default fb;

export { auth, db };
