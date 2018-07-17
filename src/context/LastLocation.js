import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import memoize from 'memoize-one'

const { Provider, Consumer } = React.createContext()

class LastLocationProvider extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
      search: PropTypes.string,
      hash: PropTypes.string,
      key: PropTypes.string,
      state: PropTypes.object
    }).isRequired,
    children: PropTypes.node.isRequired
  }

  state = {
    lastLocation: ''
  }

  hasChanged = memoize(pathname => {
    console.log('PATH HAS CHANGED, UPDATE', pathname)

    const nextState = { lastLocation: pathname }

    this.setState(nextState)

    return { lastLocation: nextState.lastLocation }
  })

  render() {
    const lastLocation = this.hasChanged(this.props.location.pathname)

    return <Provider value={lastLocation}>{this.props.children}</Provider>
  }
}

export { Consumer }

export default withRouter(LastLocationProvider)
