import Vue from 'vue'
import VuePhoneInput from './index'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(VuePhoneInput)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
