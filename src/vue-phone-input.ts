import Vue, { CreateElement, VNode } from 'vue'
import { AsYouType, CountryCode, getCountryCallingCode, parsePhoneNumber, PhoneNumber } from 'libphonenumber-js'
import CountryList from './country-list'
import { getLanguage } from './utils'
import * as MetaData from 'libphonenumber-js/metadata.full.json'

type CountryCallingCodes = { [k: string]: number }

interface LookupResponse {
  as: string
  city: string
  country: string
  countryCode: string
  isp: string
  lat: number
  lon: number
  org: string
  query: string
  region: string
  regionName: string
  status: string
  timezone: string
  zip: string
}

const VuePhoneInput = Vue.extend({
  beforeMount (): void {
    if (!this.disableExternalLookup) {
      fetch(process.env.VUE_APP_IP_API_URL)
        .then((response: Response) => response.json())
        .then((data: LookupResponse) => {
          this.selectedCountry = data.countryCode
        })
    } else {
      const lang = getLanguage()
      console.log(lang)
    }
  },
  components: {
    'country-list': CountryList
  },
  computed: {
    asYouType (): AsYouType {
      return new AsYouType(this.country as any)
    },
    country: {
      get (): CountryCode {
        if (!(this as any).selectedCountry && typeof (this as any).defaultCountry !== 'undefined') {
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
  created (): void {
    this.$on('update:selectedCountry', (country: string) => {
      this.selectedCountry = country
    })
    this.$on('update:visible', (visible: boolean) => {
      this.menuOpen = visible
    })
  },
  data () {
    return {
      menuOpen: false,
      selectedCountry: 'US' as CountryCode
    }
  },
  destroyed (): void {
    this.$off('update:selectedCountry')
    this.$off('update:visible')
  },
  props: {
    allowedCountries: {
      type: [ Array, Object ],
      required: false
    },
    defaultCountry: {
      type: [ Object, String ],
      required: false
    },
    disableExternalLookup: {
      type: Boolean,
      required: false,
      default: false
    },
    hideFlags: {
      type: Boolean,
      required: false,
      default: false
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
      type: [ Array, Object ],
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

    const innerChildren: VNode[] = []

    if (!this.hideFlags) {
      innerChildren.push(h('span', {
        class: {
          'flag-icon': true,
          [`flag-icon-${ this.country.toLowerCase() }`]: true
        },
        on: {
          click: (): void => {
            this.menuOpen = !this.menuOpen
          }
        },
        style: {
          width: '32px'
        }
      }))
    }

    innerChildren.push(h('div', {
      domProps: {
        innerHTML: `+${ getCountryCallingCode(this.country) }`
      }
    }))

    innerChildren.push(h('country-list', {
      attrs: {
        name: 'slide-fade'
      },
      props: {
        countries: Object.keys(MetaData.country_calling_codes).reduce((codes: CountryCallingCodes, code: string) => {
          const countryCodes: string[] = (MetaData.country_calling_codes as any)[code]

          countryCodes.forEach((country: string) => Object.assign(codes, { [country]: code }))

          return codes
        }, {} as CountryCallingCodes),
        selected: this.country,
        visible: self.menuOpen
      },
      style: {
        display: self.menuOpen ? 'inline-block' : 'none'
      }
    }))

    innerChildren.push(h('input', {
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
            const { value } = event.target as HTMLInputElement
            self.$emit('input', value)
          }
        }
      }
    }))

    return h('div', {
      class: {
        'vue-phone-input__wrapper': true
      }
    }, [
      h('div', {
        style: {
          display: 'inline-flex'
        }
      }, innerChildren)
    ])
  }
} as any)

export default VuePhoneInput
