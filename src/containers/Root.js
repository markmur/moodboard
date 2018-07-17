import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'
import LastLocationProvider, {
  Consumer as LastLocationConsumer
} from '../context/LastLocation'
import theme from '../styles/theme'

// Context
import AuthProvider, { Consumer as AuthConsumer } from '../context/Auth'
import FirebaseProvider from '../context/Firebase'

const Root = ({ children }) => (
  <LastLocationProvider>
    <LastLocationConsumer>
      {({ lastLocation }) => (
        <ThemeProvider theme={theme}>
          <AuthProvider lastLocation={lastLocation}>
            <AuthConsumer>
              {({ user }) => (
                <FirebaseProvider lastLocation={lastLocation} user={user}>
                  {children}
                </FirebaseProvider>
              )}
            </AuthConsumer>
          </AuthProvider>
        </ThemeProvider>
      )}
    </LastLocationConsumer>
  </LastLocationProvider>
)

Root.propTypes = {
  children: PropTypes.node.isRequired
}

export default Root
