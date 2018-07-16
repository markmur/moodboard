import React, { Component } from 'react';
import { Route, Redirect, Switch, withRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { LastLocationProvider } from 'react-router-last-location';
import { Provider } from './AuthProvider';
import theme from './theme';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Board from './pages/Board';
import Boards from './pages/Boards';
import NewBoard from './pages/NewBoard';
import Protected from './containers/Protected';

class App extends Component {
  render() {
    return (
      <LastLocationProvider>
        <ThemeProvider theme={theme}>
          <Provider>
            <Switch>
              <Redirect exact from="/" to="/boards" />
              <Route path="/login" component={Login} />

              <Protected>
                <Route path="/">
                  <div>
                    <Header />
                    <div>
                      <Switch>
                        <Route exact path="/boards" component={Boards} />
                        <Route exact path="/boards/new" component={NewBoard} />
                        <Route exact path="/boards/:id" component={Board} />
                      </Switch>
                    </div>
                    <Footer />
                  </div>
                </Route>
              </Protected>
            </Switch>
          </Provider>
        </ThemeProvider>
      </LastLocationProvider>
    );
  }
}

export default withRouter(App);
