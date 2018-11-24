import Vue from 'vue'
import VuePhoneInput from '../src'
import 'flag-icon-css/css/flag-icon.min.css'
import '../src/assets/main.styl'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VuePhoneInput)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
