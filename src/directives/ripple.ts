import { DirectiveFunction } from 'vue'

class Rippler {
  private rect: ClientRect | DOMRect
  private readonly targetBorder: number
  private left: number
  private top: number
  private width: number
  private height: number
  private dx: number
  private dy: number
  private maxX: number
  private maxY: number
  private style: CSSStyleDeclaration
  private radius: number
  private border: number
  private ripple: HTMLElement
  private rippleContainer: HTMLElement
  private readonly storedTargetPosition: string | null
  private readonly transition: number

  constructor (event: MouseEvent | any) {
    this.transition = 450

    const style: string | null | undefined = getComputedStyle(map.get('el')).borderWidth

    if (style) {
      this.targetBorder = parseInt(style.replace('px', ''), 10)
    }

    this.initGeometry(event.clientX, event.clientY)
    this.initDomElements()
    this.initRippleStyles()
    this.initRippleContainerStyles()

    if (map.get('el').style && map.get('el').style.position) {
      this.storedTargetPosition = ((map.get('el').style.position).length > 0) ? map.get('el').style.position : getComputedStyle(map.get('el')).position
    }

    if (this.storedTargetPosition && this.storedTargetPosition !== 'relative') {
      this.storedTargetPosition = 'relative'
    }

    this.rippleContainer.appendChild(this.ripple)
    map.get('el').appendChild(this.rippleContainer)

    this.ripple.style.marginLeft = `${ this.dx }px`
    this.ripple.style.marginTop = `${ this.dy }px`

    this.updateRippleContainerStyles()

    this.startRipple()

    if (event.type === 'mousedown') {
      map.get('el').addEventListener('mouseup', this.clearRipple, false)
    } else {
      this.clearRipple()
    }
  }

  private initGeometry (clientX: number, clientY: number): void {
    this.rect = map.get('el').getBoundingClientRect()
    this.left = this.rect.left
    this.top = this.rect.top
    this.width = map.get('el').offsetWidth
    this.height = map.get('el').offsetHeight
    this.dx = clientX - this.left
    this.dy = clientY - this.top
    this.maxX = Math.max(this.dx, this.width - this.dx)
    this.maxY = Math.max(this.dy, this.height - this.dy)
    this.style = window.getComputedStyle(map.get('el'))
    this.radius = Math.sqrt((this.maxX * this.maxX) + (this.maxY * this.maxY))
    this.border = (this.targetBorder > 0) ? this.targetBorder : 0
  }

  private initDomElements (): void {
    this.ripple = document.createElement('div')
    this.rippleContainer = document.createElement('div')

    this.ripple.className = 'ripple'
    this.rippleContainer.className = 'ripple-container'
  }

  private initRippleStyles (): void {
    this.ripple.style.marginTop = '0px'
    this.ripple.style.marginLeft = '0px'
    this.ripple.style.width = '1px'
    this.ripple.style.height = '1px'
    this.ripple.style.transition = 'all ' + this.transition + 'ms cubic-bezier(0.4, 0, 0.2, 1)'
    this.ripple.style.borderRadius = '50%'
    this.ripple.style.pointerEvents = 'none'
    this.ripple.style.position = 'relative'
    this.ripple.style.zIndex = '9999'
    this.ripple.style.backgroundColor = 'rgba(0, 0, 0, 0.35)'
  }

  private initRippleContainerStyles (): void {
    this.rippleContainer.style.position = 'absolute'
    this.rippleContainer.style.left = 0 - this.border + 'px'
    this.rippleContainer.style.top = 0 - this.border + 'px'
    this.rippleContainer.style.height = '0'
    this.rippleContainer.style.width = '0'
    this.rippleContainer.style.pointerEvents = 'none'
    this.rippleContainer.style.overflow = 'hidden'
    this.rippleContainer.style.display = 'flex'
    this.rippleContainer.style.flexDirection = 'row'
  }

  private updateRippleContainerStyles (): void {
    this.rippleContainer.style.width = `${ this.width }px`
    this.rippleContainer.style.height = `${ this.height }px`
    this.rippleContainer.style.borderTopLeftRadius = this.style.borderTopLeftRadius
    this.rippleContainer.style.borderTopRightRadius = this.style.borderTopRightRadius
    this.rippleContainer.style.borderBottomLeftRadius = this.style.borderBottomLeftRadius
    this.rippleContainer.style.borderBottomRightRadius = this.style.borderBottomRightRadius
    this.rippleContainer.style.direction = 'ltr'
  }

  private startRipple (): void {
    setTimeout(() => {
      this.ripple.style.width = this.radius * 2 + 'px'
      this.ripple.style.height = this.radius * 2 + 'px'
      this.ripple.style.marginLeft = this.dx - this.radius + 'px'
      this.ripple.style.marginTop = this.dy - this.radius + 'px'
    }, 0)
  }

  private clearRipple (): void {
    setTimeout(() => {
      const el = document.querySelector('.ripple') as HTMLElement

      if (el) {
        el.style.backgroundColor = 'rgba(0, 0, 0, 0)'
      }
    }, 250)

    setTimeout(() => {
      const els = document.querySelectorAll('.ripple-container') as NodeListOf<HTMLElement>

      Array.prototype.slice.call(els, 0, els.length - (els.length === 1 ? 0 : 1)).forEach((el: HTMLElement) => {
        if (el.parentNode) {
          map.get('el').removeChild(el)
        }
      })
    }, 850)

    map.get('el').removeEventListener('mouseup', this.clearRipple, false)
  }
}

const map = new Map()

const bind: DirectiveFunction = function (el: HTMLElement) {
  map.set('el', el)

  el.addEventListener('mousedown', (event: Event) => {
    new Rippler(event)
  })
}

const ripple = { bind }

export default ripple
