import Vue from 'vue'
import VuePhoneInput from '@/vue-phone-input'
import 'flag-icon-css/css/flag-icon.min.css'
import '@/assets/main.styl'
import App from '../src/App.vue'

Vue.config.productionTip = false

Vue.component('vue-phone-input', VuePhoneInput)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
