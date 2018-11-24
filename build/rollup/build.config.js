import { rollup } from 'rollup'
import configs from './base.config'
import fs from 'fs-extra'
import path from 'path'
import zlib from 'zlib'

const resolve = p => path.resolve(__dirname, '../../', p)

if (!fs.existsSync(resolve('dist'))) {
  fs.mkdirSync(resolve('dist'))
}

build(configs)

fs.copySync(resolve('dist/flags'), resolve('node_modules/flag-icon-css/flags'))

function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

function buildEntry (config) {
  return rollup(config)
    .then(bundle => bundle.generate(config.output))
    .then(({ code }) => write(config.output.file, code, true))
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
