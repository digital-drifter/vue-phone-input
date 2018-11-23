import Vue from 'vue'
import VuePhoneInput from './vue-phone-input'
import 'flag-icon-css/css/flag-icon.min.css'
import App from './App.vue'

Vue.config.productionTip = false

Vue.component('vue-phone-input', VuePhoneInput)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
