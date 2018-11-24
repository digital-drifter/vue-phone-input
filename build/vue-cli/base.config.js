module.exports = {
  chainWebpack: config => {
    config.entryPoints.delete('app')
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
