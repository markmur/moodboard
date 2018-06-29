import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { Provider } from './AuthProvider';
import theme from './theme';

import Header from './components/Header';
import Login from './pages/Login';
import Board from './pages/Board';
import Boards from './pages/Boards';
import NewBoard from './pages/NewBoard';
import Protected from './containers/Protected';

const Content = styled.div`
  max-width: 1200px;
  padding: 0 2em;
`;

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Provider>
          <Switch>
            <Redirect exact from="/" to="/boards/1" />
            <Route path="/login" component={Login} />

            <Protected>
              <Route path="/">
                <div>
                  <Header />
                  <Content>
                    <Switch>
                      <Route exact path="/boards" component={Boards} />
                      <Route exact path="/boards/new" component={NewBoard} />
                      <Route exact path="/boards/:id" component={Board} />
                    </Switch>
                  </Content>
                </div>
              </Route>
            </Protected>
          </Switch>
        </Provider>
      </ThemeProvider>
    );
  }
}

export default App;
