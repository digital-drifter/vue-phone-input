let config

switch (process.env.NODE_ENV) {
  case 'development':
    config = require('./build/vue-cli/demo.config')
    break
  case 'production':
    config = require('./build/vue-cli/lib.config')
    break
  default:
    config = require('./build/vue-cli/demo.config')
}

module.exports = config
