import Vue, { PluginFunction, VueConstructor } from 'vue'
import { default as _VuePhoneInput } from './vue-phone-input'
import Countries from './assets/data/countries.json'
import './assets/styles/main.styl'

const VuePhoneInput: PluginFunction<any> = (v: VueConstructor<Vue>): void => {
  Object.defineProperty(v.prototype, 'vpi', {
    value: {
      countries: Countries
    }
  })
  v.component('vue-phone-input', _VuePhoneInput)
}

export default VuePhoneInput
