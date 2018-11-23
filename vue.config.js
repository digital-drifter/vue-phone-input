const path = require('path')

module.exports = {
  chainWebpack: config => {
    config.entryPoints.delete('app')

    config.entry('lib').add('src', 'index.ts')
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'stylus',
      patterns: [
        path.resolve(__dirname, 'src/assets/*.styl')
      ]
    }
  }
}
