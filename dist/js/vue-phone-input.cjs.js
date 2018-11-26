'use strict';

var _VuePhoneInput = require('./vue-phone-input');
require('./assets/styles/main.styl');

const VuePhoneInput = (v) => {
    v.component('vue-phone-input', _VuePhoneInput);
};

module.exports = VuePhoneInput;
