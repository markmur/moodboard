import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppContainer as HotReload } from 'react-hot-loader'
import App from './app'
import registerServiceWorker from './registerServiceWorker'

import './styles/index.css'

const outlet = document.getElementById('root')

const render = Component => {
  ReactDOM.render(
    <HotReload>
      <Router>
        <Component />
      </Router>
    </HotReload>,
    outlet
  )
}

render(App)
registerServiceWorker()

if (module.hot) {
  module.hot.accept('./app', () => {
    render(App)
  })
}
