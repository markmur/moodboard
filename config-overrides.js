const rewireVendorSplitting = require('react-app-rewire-vendor-splitting')

module.exports = function(config, env) {
  config = rewireVendorSplitting(config, env)

  return config
}
