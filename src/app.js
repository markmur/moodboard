import React, { Component } from 'react'
import { Route, Redirect, Switch, withRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { LastLocationProvider } from 'react-router-last-location'
import theme from './styles/theme'

// Import styles for react-tippy (tooltips)
import 'react-tippy/dist/tippy.css'

// Context
import AuthProvider, { Consumer as AuthConsumer } from './context/Auth'
import FirebaseProvider, {
  Consumer as FirebaseConsumer
} from './context/Firebase'

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
      <ThemeProvider theme={theme}>
        <LastLocationProvider>
          {location => {
            console.log({ location })
          }}
          <AuthProvider>
            <AuthConsumer>
              {({ user }) => (
                <FirebaseProvider user={user}>
                  <Switch>
                    <Redirect exact from="/" to="/boards" />
                    <Route path="/login" component={Login} />
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
                                        <Board
                                          {...props}
                                          user={user}
                                          store={store}
                                        />
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
                </FirebaseProvider>
              )}
            </AuthConsumer>
          </AuthProvider>
        </LastLocationProvider>
      </ThemeProvider>
    )
  }
}

export default withRouter(App)
