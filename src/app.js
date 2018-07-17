import React, { Component } from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'

import Root from './containers/Root'

// Context
import { Consumer as FirebaseConsumer } from './context/Firebase'
import { Consumer as LastLocationConsumer } from './context/LastLocation'

// Components
import Header from './components/Header'
import Loader from './components/Loader'
import Footer from './components/Footer'
import Login from './pages/Login'
import Board from './pages/Board'
import Boards from './pages/Boards'
import NewBoard from './pages/NewBoard'
import Protected from './containers/Protected'

class App extends Component {
  render() {
    return (
      <Root>
        <LastLocationConsumer>
          {({ lastLocation }) => (
            <Switch>
              <Redirect exact from="/" to="/boards" />
              <Route
                path="/login"
                component={props => (
                  <Login {...props} lastLocation={lastLocation} />
                )}
              />
              <Protected>
                <Route path="/">
                  <div>
                    <div>
                      <Header />
                      <FirebaseConsumer>
                        {store => (
                          <div>
                            {store.loading && <Loader />}
                            <Switch>
                              <Route
                                exact
                                path="/boards"
                                render={props => (
                                  <Boards {...props} store={store} />
                                )}
                              />
                              <Route
                                exact
                                path="/boards/new"
                                component={NewBoard}
                              />
                              <Route
                                exact
                                path="/boards/:id"
                                render={props => (
                                  <Board {...props} store={store} />
                                )}
                              />
                            </Switch>
                          </div>
                        )}
                      </FirebaseConsumer>
                      <Footer />
                    </div>
                  </div>
                </Route>
              </Protected>
            </Switch>
          )}
        </LastLocationConsumer>
      </Root>
    )
  }
}

export default withRouter(App)
