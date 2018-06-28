import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

const { auth } = firebase;
const db = firebase.firestore(app);

db.settings({ timestampsInSnapshots: true });

const provider = new firebase.auth.GoogleAuthProvider();

const login = () => {
  return firebase
    .auth()
    .signInWithRedirect(provider)
    .then(result => {
      const { user } = result;

      db.collection('users')
        .doc(user.uid)
        .set({
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email
        });
    })
    .catch(error => {
      const { code, message, email, credential } = error;

      console.error({ code, message, email, credential });
    });
};

export { auth, db, login };
