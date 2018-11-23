import Vue, { CreateElement, VNode } from 'vue'

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
          listItem.context.$emit('input', listItem.key)
        }
      }
    },
    style: {
      padding: '3px 15px',
      display: 'inline-block'
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

  if (listItem.context && listItem.data && listItem.key === (listItem.context as any).selected) {
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
  props: [ 'countries', 'selected', 'value' ],
  render: function (h: CreateElement): VNode {
    return h('div', {
      class: {
        'list-wrapper': true
      }
    }, [
      h('input', {
        attrs: {
          maxlength: 2,
          type: 'text'
        },
        on: {
          input: (event: InputEvent): void => {
            if (event.target) {
              const { value } = event.target as HTMLInputElement
              this.filter = value
            }
          }
        }
      }),
      h('transition-group', {
        attrs: {
          name: 'list'
        },
        tag: 'ul'
      }, Object.keys(this.countries)
        .filter((country: string) => !this.filter.length || country.includes(this.filter))
        .reduce((list: VNode[], country: string) => [ ...list, createListItem(h, country, this.countries[country]) ], []))
    ])
  }
})

export default CountryList
