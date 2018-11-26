(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('./vue-phone-input'), require('./assets/styles/main.styl')) :
  typeof define === 'function' && define.amd ? define(['./vue-phone-input', './assets/styles/main.styl'], factory) :
  (global.VuePhoneInput = factory(global._VuePhoneInput));
}(this, (function (_VuePhoneInput) { 'use strict';

  const VuePhoneInput = (v) => {
      v.component('vue-phone-input', _VuePhoneInput);
  };

  return VuePhoneInput;

})));
