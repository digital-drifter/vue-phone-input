const path = require('path')

module.exports = {
  outputDir: 'dist',
  chainWebpack: config => {
    config.entryPoints.delete('app')
    config.entry('demo').add('demo/main.ts')
    config.plugins.delete('copy')
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
