import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import node from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2'
import autoExternal from 'rollup-plugin-auto-external'
import { terser } from 'rollup-plugin-terser'
import replace from 'rollup-plugin-re'
import autoprefixer from 'autoprefixer'
import path from 'path'

const resolve = p => path.resolve(__dirname, '../../', p)

const configs = [
  {
    file: resolve('dist/js/vue-phone-input.js'),
    format: 'umd',
    env: process.env.NODE_ENV || '\'development\''
  },
  {
    file: resolve('dist/js/vue-phone-input.min.js'),
    format: 'umd',
    env: process.env.NODE_ENV || '\'production\''
  },
  {
    file: resolve('dist/js/vue-phone-input.cjs.js'),
    format: 'cjs',
    env: process.env.NODE_ENV || '\'production\''
  },
  {
    file: resolve('dist/js/vue-phone-input.esm.js'),
    format: 'es',
    env: process.env.NODE_ENV || '\'production\''
  }
].map((opts) => {
  const plugins = [
    replace({
    replaces: {
      'process.env.NODE_ENV': opts.env
    }
  }),
    node({
      extensions: [ '.js', '.json', '.ts' ]
    }),
    babel({
      runtimeHelpers: true,
      exclude: [
        'node_modules/**',
        'src/assets/**'
      ]
    }),
    json(),
    postcss({
      minimize: true,
      sourceMap: true,
      extensions: [ '.css', '.scss', '.sass', '.styl', '.less' ],
      extract: resolve('dist/css/vue-phone-input.css'),
      plugins: [
        autoprefixer()
      ]
    }),
    typescript({
      tsconfig: resolve('src/tsconfig.json')
    })
  ]

  // if (opts.format === 'umd') {
    plugins.push(commonjs())
  // }

  if (opts.env === 'production') {
    plugins.push(terser())
  }

  plugins.push(autoExternal({
    builtins: false,
    dependencies: true,
    peerDependencies: false,
    packagePath: resolve('package.json')
  }))

  return {
    cache: false,
    external: ['vue'],
    input: resolve('src/index.ts'),
    plugins,
    output: {
      globals: {
        'vue': 'Vue'
      },
      interop: false,
      file: opts.file,
      format: opts.format,
      name: 'VuePhoneInput'
    },
    onwarn: (warning) => {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        console.error(`(!) ${ warning.message }`)
      }
    }
  }
})

module.exports = configs

export default configs
