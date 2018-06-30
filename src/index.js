import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

const outlet = document.getElementById('root');

const render = () => {
  ReactDOM.render(
    <Router>
      <App />
    </Router>,
    outlet
  );
};

render();
registerServiceWorker();

if (module.hot) {
  module.hot.accept('./app', () => {
    render();
  });
}
