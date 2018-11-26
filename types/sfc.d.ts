import Vue from 'vue'
import vpi from './vue-phone-input'

declare module 'vue/types/vue' {
  interface Vue {
    vpi: typeof vpi
  }
}
