import Vue, { CreateElement, VNode } from 'vue'
import clickOutside from './directives/click-outside'
import { CountryInfo, ListItemGenerator } from '../types'

const createListItem: ListItemGenerator = function (h: CreateElement, cca2: string, country: CountryInfo): VNode {
  const listItem = h('li', {
    class: {
      active: false
    },
    key: cca2,
    on: {
      click: (): void => {
        if (listItem.context) {
          listItem.context.$parent.$emit('update:country', country)
          listItem.context.$parent.$emit('update:visible', false)
        }
      }
    },
    style: {
      borderBottom: '1px solid rgba(96,125,139,.2)'
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
    h('span', {
      style: {
        flexDirection: 'column'
      }
    }, [
      h('span', {
        domProps: {
          innerHTML: `${ country.name.common } (+${ country.callingCode })`
        },
        style: {
          color: 'rgba(96,125,139,.6)',
          flexDirection: 'row',
          alignItems: 'center',
          flexGrow: 1
        }
      }),
      h('span', {
        domProps: {
          innerHTML: country.name.native
        },
        style: {
          color: 'rgba(96,125,139,.6)',
          flexDirection: 'row',
          alignItems: 'center',
          flexGrow: 1
        }
      })
    ])
  ])

  if (listItem.context && listItem.data && (listItem.key === (listItem.context as any).selected.cca2)) {
    Object.assign(listItem.data.class, { active: true })
  }

  return listItem
}

const CountryList = Vue.extend({
  created (): void {
    if (this.selected) {
      this.filter = typeof this.selected.name !== 'undefined' ? this.selected.name.common : ''
    }
  },
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
  props: [ 'countries', 'selected', 'visible' ],
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
      h('span', {
          style: {
            display: 'flex'
          }
        },
        [
          h('input', {
            attrs: {
              placeholder: this.filter.length === 0 ? 'Search Countries...' : '',
              type: 'text'
            },
            domProps: {
              value: this.filter
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
            },
            style: {
              flexGrow: 5
            }
          }),
          h('span', {
            class: {
              clearable: true
            },
            domProps: {
              innerHTML: 'X'
            },
            on: {
              click: (): void => {
                this.$parent.$emit('update:country', {})
                this.filter = ''
              }
            }
          })
        ]),
      h('transition-group', {
        attrs: {
          name: 'list'
        },
        key: 'list-items',
        ref: 'list',
        tag: 'ul'
      }, Object.keys(this.countries).filter((cca2: string) => {
        const country = this.countries[cca2]
        const filter: string = this.filter.toLowerCase()

        switch (true) {
          case !filter.length:
          case cca2.toLowerCase().includes(filter):
          case country.name.common.toLowerCase().includes(filter):
          case country.name.official.toLowerCase().includes(filter):
            return true
          default:
            return false
        }
      })
        .reduce((list: VNode[], cca2: string) => [ ...list, createListItem(h, cca2, this.countries[cca2]) ], []))
    ])
  },
  watch: {
    visible: {
      immediate: true,
      handler: function (isVisible: boolean): void {
        if (isVisible) {
          const activeElement = document.querySelector('li.active') as HTMLElement

          if (activeElement) {
            if (this.selected) {
              this.filter = this.selected.name.common
            }

            const { $el } = this.$refs.list as Vue

            $el.scrollTo(0, activeElement.offsetTop)
          }
        }
      }
    }
  }
})

export default CountryList
