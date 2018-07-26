const rewireVendorSplitting = require('react-app-rewire-vendor-splitting')
const rewireReactHotLoader = require('react-app-rewire-hot-loader')

module.exports = function(config, env) {
  config = rewireVendorSplitting(config, env)
  config = rewireReactHotLoader(config, env)

  return config
}
