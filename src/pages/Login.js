import React from 'react';
import { login } from '../firebase';

const Login = () => (
  <div>
    <h1>Moodboard</h1>

    <button type="button" onClick={login}>
      Login with Google
    </button>
  </div>
);

export default Login;
