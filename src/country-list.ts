import Vue, { CreateElement, VNode } from 'vue'
import clickOutside from './click-outside'
import Countries from './assets/countries.json'

type ListItemGenerator = (h: CreateElement, cca2: string, country: CountryInfo) => VNode

interface CountryInfo {
  name: {
    common: string
    official: string
    native?: string
  }
  flag: string
  callingCode?: string | number
}

const createListItem: ListItemGenerator = function (h: CreateElement, cca2: string, country: CountryInfo): VNode {
  const listItem = h('li', {
    class: {
      active: false
    },
    key: cca2,
    on: {
      click: (): void => {
        if (listItem.context) {
          listItem.context.$parent.$emit('update:selectedCountry', listItem.key)
        }
      }
    }
  }, [
    h('span', {
      class: {
        flag: true
      },
      domProps: {
        innerHTML: country.flag
      }
    }),
    h('span', [
      h('span', {
        domProps: {
          innerHTML: `${country.name.common} (+${ country.callingCode })`
        },
        style: {
          color: 'rgba(96,125,139,.6)'
        }
      }),
      h('span', {
        domProps: {
          innerHTML: country.name.native
        },
        style: {
          color: 'rgba(96,125,139,.6)'
        }
      })
    ])
  ])

  if (listItem.context && listItem.data && (listItem.key === (listItem.context as any).selected)) {
    Object.assign(listItem.data.class, { active: true })
  }

  return listItem
}

const CountryList = Vue.extend({
  data () {
    return {
      filter: ''
    }
  },
  directives: {
    'click-outside': clickOutside
  },
  methods: {
    onClickOutside (): void {
      if (this.visible) {
        this.$parent.$emit('update:visible', false)
      }
    }
  },
  props: [ 'selected', 'visible' ],
  render: function (h: CreateElement): VNode {
    return h('div', {
      class: {
        'list-wrapper': true
      },
      directives: [
        {
          arg: '',
          expression: '',
          modifiers: {},
          name: 'click-outside',
          oldValue: this.visible,
          value: this.onClickOutside
        }
      ]
    }, [
      h('input', {
        attrs: {
          maxlength: 2,
          type: 'text'
        },
        domProps: {
          value: this.selected
        },
        key: 'list-input',
        on: {
          input: (event: InputEvent): void => {
            if (event.target) {
              const { value } = event.target as HTMLInputElement
              this.$nextTick(() => {
                this.filter = value
              })
            }
          }
        }
      }),
      h('transition-group', {
        attrs: {
          name: 'list'
        },
        key: 'list-items',
        ref: 'list',
        tag: 'ul'
      }, Object.keys(Countries as { [k: string]: CountryInfo })
        .filter((cca2: string) => {
          const country = (Countries as { [k: string]: CountryInfo })[cca2]

          switch (true) {
            case !this.filter.length:
            case cca2.includes(this.filter):
            case country.name.common.includes(this.filter):
            case country.name.official.includes(this.filter):
              return true
            default:
              return false
          }
        })
        .reduce((list: VNode[], cca2: string) => [ ...list, createListItem(h, cca2, (Countries as { [k: string]: CountryInfo })[cca2]) ], []))
    ])
  },
  watch: {
    visible: {
      immediate: true,
      handler: function (isVisible: boolean): void {
        if (isVisible) {
          const activeElement = document.querySelector('li.active') as HTMLElement

          if (activeElement) {
            const { $el } = this.$refs.list as Vue

            $el.scrollTo(0, activeElement.offsetTop)
          }
        }
      }
    }
  }
})

export default CountryList
