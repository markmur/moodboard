import React, { Component } from 'react';
import { Route, Redirect, Link, Switch } from 'react-router-dom';
import { Provider, Consumer } from './auth';
import firebase from './firebase';
import Login from './pages/Login';
import Board from './pages/Board';
import Boards from './pages/Boards';
import Protected from './containers/Protected';

class App extends Component {
  render() {
    return (
      <Provider>
        <h1>Moodz</h1>
        <Link to="/boards">Boards</Link>
        <Consumer>
          {({ authenticated }) =>
            authenticated && (
              <button type="button" onClick={firebase.logout}>
                Logout
              </button>
            )
          }
        </Consumer>
        <div>
          <Switch>
            <Redirect exact from="/" to="/boards" />

            <Route path="/login" component={Login} />

            <Protected>
              <Route path="/boards" component={Boards} />
              <Route path="/boards/:id" component={Board} />
            </Protected>
          </Switch>
        </div>
      </Provider>
    );
  }
}

export default App;
