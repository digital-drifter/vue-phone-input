const path = require('path')

module.exports = {
  chainWebpack: config => {
    config.entryPoints.delete('app')

    config.entry('lib').add(path.resolve(__dirname, 'src', 'index.ts'))
  }
}
