const fs = require('fs-extra')
const path = require('path')
const WorldCountries = require('world-countries')
const LibphonenumberJS = require('libphonenumber-js')

const countries = WorldCountries.filter(({ callingCode }) => Array.isArray(callingCode) && callingCode.length > 0)
  .reduce((obj, { cca2, cca3, name: { common, official, native }, flag, callingCode }) => {
    const country = Object.assign(obj, {
      [cca2]: { cca2, flag, name: { common, official } }
    })

    try {
      Object.assign(country[cca2], {
        callingCode: LibphonenumberJS.getCountryCallingCode(cca2)
      })
    } catch (e) {
      Object.assign(country[cca2], {
        callingCode: (Array.isArray(callingCode) && (callingCode.length > 0)) ? parseInt(callingCode.shift(), 10) : undefined
      })
    }

    if ((typeof native !== 'undefined') && (Object.keys(native).length > 0)) {
      Object.assign(country[cca2].name, {
        native: native.hasOwnProperty(cca3.toLowerCase()) ? native[cca3.toLowerCase()].official : native[Object.keys(native).shift()].official
      })
    }

    return country
  }, {})

const filename = path.resolve(__dirname, '../src/assets/data/countries.json')

if (fs.existsSync(filename)) {
  fs.unlinkSync(filename)
}
fs.ensureFileSync(filename)
fs.writeJsonSync(filename, countries)
