import Vue, { CreateElement, VNode } from 'vue'
import { AsYouType, parsePhoneNumber, PhoneNumber } from 'libphonenumber-js'
import CountryList from './country-list'
import Countries from './assets/data/countries.json'
import { CountryCatalog, CountryInfo } from '../types'
import ripple from './directives/ripple'

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
      return new AsYouType(this.country as any)
    },
    countries () {
      return Countries as { [k: string]: CountryInfo }
    },
    isValid (): boolean {
      if ((this.asYouType !== undefined) && (typeof (this as any).asYouType.getNumber === 'function')) {
        return (this as any).asYouType.getNumber() ? (this as any).asYouType.getNumber().isValid() : false
      }

      return false
    },
    phoneNumber (): PhoneNumber | undefined {
      try {
        return parsePhoneNumber(this.value, this.country)
      } catch (e) {
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
        },
        style: {
          flexGrow: 1,
          textAlign: 'center'
        }
      }, [
        h('svg', {
          attrs: {
            width: '8px', // this.menuOpen ? '6px' : '8px',
            height: '6px', // this.menuOpen ? '8px' : '6px'
          }
        }, [
          h('polygon', {
            attrs: {
              points: '0,0 8,3 0,6' // this.menuOpen ? '0,0 6,0 3,8' : '0,0 8,3 0,6'
            }
          })
        ])
      ])
    ]))

    if (!this.hideFlags) {
      innerChildren.push(h('span', {
        domProps: {
          innerHTML: this.country.flag
        },
        on: {
          click: (): void => {
            this.menuOpen = !this.menuOpen
          }
        },
        style: {
          flexGrow: 1,
          textAlign: 'center'
        }
      }))
    }

    // innerChildren.push(h('div', {
    //   domProps: {
    //     innerHTML: `+${ this.country.callingCode }`
    //   },
    //   style: {
    //     flexGrow: 1
    //   }
    // }))

    innerChildren.push(h('country-list', {
      attrs: {
        name: 'slide-fade'
      },
      props: {
        countries: Object.keys(Countries).reduce((obj: CountryCatalog, cca2: string) => {
          if (Array.from(this.allowedCountries) && (this.allowedCountries.length > 0)) {
            const allowed = this.allowedCountries.map((country: string) => country.toLowerCase()).includes(cca2.toLowerCase())

            return allowed ? Object.assign(obj, { [cca2]: (Countries as any)[cca2] }) : obj
          }
          return obj
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
            self.$emit('input', value)
          }
        }
      },
      style: {
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
  }
} as any)

export default VuePhoneInput
