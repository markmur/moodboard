import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { Provider } from './auth';
import Header from './components/Header';
import Login from './pages/Login';
import Board from './pages/Board';
import Boards from './pages/Boards';
import Protected from './containers/Protected';

class App extends Component {
  render() {
    return (
      <Provider>
        <Header />

        <div>
          <Switch>
            <Redirect exact from="/" to="/boards/1" />
            <Route path="/login" component={Login} />

            <Protected>
              <Route exact path="/boards" component={Boards} />
              <Route exact path="/boards/:id" component={Board} />
            </Protected>
          </Switch>
        </div>
      </Provider>
    );
  }
}

export default App;
