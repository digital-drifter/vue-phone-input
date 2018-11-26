import Vue, { PluginFunction, VueConstructor } from 'vue'
import { default as _VuePhoneInput } from './vue-phone-input'
import './assets/styles/main.styl'

const VuePhoneInput: PluginFunction<any> = (v: VueConstructor<Vue>): void => {
  v.component('vue-phone-input', _VuePhoneInput)
}

export default VuePhoneInput
