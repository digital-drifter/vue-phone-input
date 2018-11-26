import Vue, { CreateElement, VNode } from 'vue'
import { AsYouType, parsePhoneNumber, PhoneNumber } from 'libphonenumber-js'
import CountryList from './country-list'
import Countries from './assets/data/countries.json'
import { CountryCatalog, CountryInfo } from '../types'
import ripple from './directives/ripple'

const countries: CountryCatalog = Countries

const VuePhoneInput = Vue.extend({
  // beforeMount (): void {
  //   if (!this.disableExternalLookup && process.env.VUE_APP_IP_API_URL) {
  //     fetch(process.env.VUE_APP_IP_API_URL)
  //       .then((response: Response) => response.json())
  //       .then((data: LookupResponse) => {
  //         this.country = data.countryCode
  //       })
  //   } else {
  //     // const lang = getLanguage()
  //   }
  // },
  components: {
    'country-list': CountryList
  },
  computed: {
    asYouType (): AsYouType {
      if (this.country) {
        return new AsYouType(this.country as any)
      }

      return new AsYouType('US')
    },
    isValid (): boolean {
      if ((this.asYouType !== undefined) && (typeof (this as any).asYouType.getNumber === 'function')) {
        return (this as any).asYouType.getNumber() ? (this as any).asYouType.getNumber().isValid() : false
      }

      return false
    },
    phoneNumber (): PhoneNumber | undefined {
      try {
        const parsed =  parsePhoneNumber(this.value, this.country.cca2)
        console.log(parsed)
        return parsed
      } catch (e) {
        console.log(e)
        return undefined
      }
    }
  } as any,
  created (): void {
    this.$on('update:country', (country: CountryInfo) => {
      this.country = country
    })
    this.$on('update:visible', (visible: boolean) => {
      this.menuOpen = visible
    })
  },
  data () {
    return {
      menuOpen: false,
      country: {} as CountryInfo
    }
  },
  destroyed (): void {
    this.$off('update:country')
    this.$off('update:visible')
  },
  directives: {
    'v-ripple': ripple
  },
  props: {
    allowedCountries: {
      type: Array,
      required: false,
      default: () => []
    },
    defaultCountry: {
      type: String,
      required: false,
      default: () => 'US'
    },
    disableExternalLookup: {
      type: Boolean,
      required: false,
      default: true
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
      type: Array,
      required: false
    },
    value: {
      type: String
    }
  },
  render: function (h: CreateElement): VNode {
    const self = this

    const asYouType: () => AsYouType = () => {
      if (this.country) {
        return new AsYouType(this.country.cca2)
      }

      return new AsYouType('US')
    }

    const innerChildren: VNode[] = []

    innerChildren.push(h('transition', {
      attrs: {
        name: 'arrow-indicator'
      }
    }, [
      h('span', {
        class: {
          'arrow-indicator': true,
          'open': this.menuOpen
        },
        on: {
          click: (): void => {
            this.menuOpen = !this.menuOpen
          }
        }
      }, [
        h('svg', {
          attrs: {
            width: '8px',
            height: '6px',
          }
        }, [
          h('polygon', {
            attrs: {
              points: '0,0 8,3 0,6'
            }
          })
        ])
      ])
    ]))

    if (!this.hideFlags) {
      innerChildren.push(h('span', {
        class: {
          'flag-indicator': true
        },
        domProps: {
          innerHTML: this.country.flag
        },
        on: {
          click: (): void => {
            this.menuOpen = !this.menuOpen
          }
        }
      }))
    }

    innerChildren.push(h('country-list', {
      attrs: {
        name: 'slide-fade'
      },
      props: {
        countries: Object.keys(countries).filter((cca2: string) => {
          return !this.allowedCountries.length || this.allowedCountries.map((allowed: string) => allowed.toLowerCase()).includes(cca2.toLowerCase())
        }).reduce((obj: CountryCatalog, cca2: string) => {
          return Object.assign(obj, { [cca2]: countries[cca2] })
        }, {} as CountryCatalog),
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
            self.$emit('input', Array.isArray(value) ? value.shift() : value)
          }
        }
      },
      ref: 'phoneNumberInput',
      style: {
        alignSelf: 'center',
        flexGrow: 4
      }
    }))

    return h('div', {
      class: {
        'vue-phone-input__wrapper': true
      },
      directives: [
        {
          arg: '',
          expression: '',
          modifiers: {},
          name: 'v-ripple',
          oldValue: undefined,
          value: undefined
        }
      ]
    }, [
      h('div', {
        style: {
          display: 'flex'
        }
      }, innerChildren)
    ])
  },
  watch: {
    menuOpen: {
      handler: function (isOpen: boolean): void {
        if (!isOpen) {
          (this as any).$nextTick(() => {
            ((this as any).$refs.phoneNumberInput as HTMLInputElement).focus()
          })
        }
      }
    }
  }
} as any)

export default VuePhoneInput
