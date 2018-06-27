import firebase from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyCWRkSFhOVTfGxe4eT_IcvmYFIyMQmn9tA',
  authDomain: 'moodboard-b788b.firebaseapp.com',
  databaseURL: 'https://moodboard-b788b.firebaseio.com',
  projectId: 'moodboard-b788b',
  storageBucket: 'moodboard-b788b.appspot.com',
  messagingSenderId: '58231872924'
};

if (firebase.apps.length <= 0) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

firebase
  .auth()
  .signInWithPopup(provider)
  .then(result => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const token = result.credential.accessToken;
    // The signed-in user info.
    const { user } = result;
    console.log({ token, user });
  })
  .catch(error => {
    const { code, message, email, credential } = error;

    console.log({ code, message, email, credential });
  });

export { auth };
