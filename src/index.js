import React from 'react';
import ReactDOM from 'react-dom';
import { auth } from './firebase';
import App from './app';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

console.log({ auth });

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
