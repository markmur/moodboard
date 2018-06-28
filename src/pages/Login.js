import React from 'react';
import firebase from '../firebase';

const Login = () => (
  <div>
    <h1>Moodboard</h1>

    <button type="button" onClick={firebase.login}>
      Login with Google
    </button>
  </div>
);

export default Login;
