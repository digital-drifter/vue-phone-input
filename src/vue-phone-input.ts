import Vue, { CreateElement, VNode } from 'vue'
import { AsYouType, CountryCode, getCountryCallingCode, parsePhoneNumber, PhoneNumber } from 'libphonenumber-js'
import CountryList from './countries'
import * as MetaData from 'libphonenumber-js/metadata.full.json'

console.log(MetaData.country_calling_codes)

type CountryCallingCodes = { [k: string]: number }

const VuePhoneInput = Vue.extend({
  data () {
    return {
      menuOpen: false,
      selectedCountry: '' as CountryCode
    }
  },
  components: {
    CountryList
  },
  computed: {
    asYouType (): AsYouType {
      return new AsYouType(this.country as any)
    },
    country: {
      get (): CountryCode {
        if (!(this as any).selectedCountry) {
          (this as any).selectedCountry = (this as any).defaultCountry as any
        }
        return (this as any).selectedCountry
      },
      set (value: CountryCode) {
        (this as any).selectedCountry = value
      }
    },
    isValid (): boolean {
      if ((this.asYouType !== undefined) && (typeof (this as any).asYouType.getNumber === 'function')) {
        return (this as any).asYouType.getNumber() ? (this as any).asYouType.getNumber().isValid() : false
      }

      return false
    },
    phoneNumber (): PhoneNumber | undefined {
      try {
        return parsePhoneNumber((this as any).value, (this as any).country)
      } catch (e) {
        return undefined
      }
    }
  },
  props: {
    allowedCountries: {
      type: [Array, Object],
      required: false
    },
    defaultCountry: {
      type: [Object, String],
      required: false,
      default: 'PG' as CountryCode
    },
    name: {
      type: String,
      required: false,
      default: 'phone_number'
    },
    placeholder: {
      type: String,
      required: false,
      default: 'Enter Phone Number'
    },
    preferredCountries: {
      type: [Array, Object],
      required: false
    },
    value: {
      type: String
    }
  },
  render: function (h: CreateElement): VNode {
    const self = this

    const asYouType: () => AsYouType = () => {
      return new AsYouType(self.country)
    }

    const countryListDropdown = h('country-list', {
      props: {
        countries: Object.keys(MetaData.country_calling_codes).reduce((codes: CountryCallingCodes, code: string) => {
          const countryCodes: string[] = (MetaData.country_calling_codes as any)[code]

          countryCodes.forEach((country: string) => Object.assign(codes, { [country]: code }))

          return codes
        }, {} as CountryCallingCodes),
        selected: this.country
      },
      style: {
        display: self.menuOpen ? 'inline-block' : 'none'
      }
    })

    const children: string | VNode | VNode[] = [
      h('div', {
        style: {
          display: 'inline-flex'
        }
      }, [
        h('span', {
          class: {
            'flag-icon': true,
            [`flag-icon-${ this.country.toLowerCase() }`]: true
          },
          on: {
            click: (event: MouseEvent): void => {
              this.menuOpen = !this.menuOpen
            }
          },
          style: {
            width: '32px'
          }
        }),
        h('div', {
          domProps: {
            innerHTML: `+${getCountryCallingCode(this.country)}`
          }
        }),
        countryListDropdown,
        h('input', {
          attrs: {
            name: self.name,
            placeholder: self.placeholder,
            type: 'tel'
          },
          class: {
            'is-valid': self.phoneNumber ? self.phoneNumber.isValid() : false
          },
          domProps: {
            value: asYouType().input(self.value)
          },
          on: {
            input: function (event: InputEvent) {
              if (event.target) {
                const {value} = event.target as HTMLInputElement
                self.$emit('input', value)
              }
            }
          }
        })
      ])
    ]

    return h('div', {
      class: {
        'vue-phone-input__wrapper': true
      }
      // props: {
      //   asYouType: {
      //     type: Object,
      //     required: false,
      //     default: () => new AsYouType(self.country)
      //   }
      // }
      // scopedSlots: {
      //   label: (props: Dictionary<any>): VNode | VNode[] => {
      //     return h('')
      //   }
      // }
    }, children)
  }
} as any)

export default VuePhoneInput
