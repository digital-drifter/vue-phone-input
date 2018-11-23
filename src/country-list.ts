import Vue, { CreateElement, VNode } from 'vue'
import clickOutside from './click-outside'

type ListItemGenerator = (h: CreateElement, country: string, code: number) => VNode

const createListItem: ListItemGenerator = function (h: CreateElement, country: string, code: number): VNode {
  const listItem = h('li', {
    class: {
      active: false
    },
    key: country,
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
        'flag-icon': true,
        [`flag-icon-${ country.toLowerCase() }`]: true
      }
    }),
    h('span', {
      domProps: {
        innerHTML: `${country} (+${ code })`
      },
      style: {
        color: 'rgba(96,125,139,.6)',
        position: 'absolute',
        right: '1rem'
      }
    })
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
      }, Object.keys(this.countries)
        .filter((country: string) => !this.filter.length || country.includes(this.filter))
        .reduce((list: VNode[], country: string) => [ ...list, createListItem(h, country, this.countries[country]) ], []))
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
