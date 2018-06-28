import firebase from 'firebase/app';
import ow from 'ow';
import 'firebase/auth';
import 'firebase/firestore';

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

  addImageToBoard(id, file, { x, y, name }) {
    const url = `images/${name}`;
    const upload = storage.ref(url).put(file);

    upload.on(firebase.storage.TaskEvent.STATE_CHANGED, {
      next: this.handleUploadProgress,
      error: this.handleImageUploadError,
      complete: async () => {
        const referenceUrl = await storage.getDownloadURL();

        db.collection(BOARDS)
          .doc(id)
          .collection(IMAGES)
          .add({
            name,
            href: referenceUrl,
            position: {
              x,
              y
            }
          });
      }
    });
  }
}

const fb = new FirebaseClient();

export default fb;

export { auth, db };
