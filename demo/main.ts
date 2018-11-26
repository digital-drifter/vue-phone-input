import Vue from 'vue'
import VuePhoneInput from '../docs/js/vue-phone-input'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VuePhoneInput)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
