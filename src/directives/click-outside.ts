import { VNodeDirective } from 'vue'

interface EventHandler {
  event: string
  handler: (event: Event) => void
}

interface DirectiveInstance {
  el: HTMLElement
  eventHandlers: EventHandler[]
}

type EventHandlerArgs = {
  el: Element
  event: any
  handler: (event: string, el: Element) => void
  middleware: any
}

const isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0
const eventNames = isTouch ? ['touchstart', 'click'] : ['click']
const instances: DirectiveInstance[] = []

function processDirectiveArguments(bindingValue: any): { handler: (event: string, el: Element) => void, middleware: ((isClickOuside: boolean) => boolean), events: string[] } {
  const isFunction = typeof bindingValue === 'function'
  if (!isFunction && typeof bindingValue !== 'object') {
    throw new Error('v-click-outside: Binding value must be a function or an object')
  }

  return {
    handler: isFunction ? bindingValue : bindingValue.handler,
    middleware: bindingValue.middleware || ((isClickOutside: boolean) => isClickOutside),
    events: bindingValue.events || eventNames,
  }
}

function onEvent({ el, event, handler, middleware }: EventHandlerArgs) {
  const isClickOutside = event.target !== el && !el.contains(event.target)

  if (!isClickOutside) {
    return
  }

  if (middleware(event, el)) {
    handler(event, el)
  }
}

function bind(el: HTMLElement, { value }: VNodeDirective) {
  const { handler, middleware, events } = processDirectiveArguments(value)

  const instance: DirectiveInstance = {
    el,
    eventHandlers: events.map((eventName: string) => ({
      event: eventName,
      handler: (event: Event) => onEvent({ event, el, handler, middleware }),
    })),
  }

  instance.eventHandlers.forEach((eventHandler: EventHandler) => document.addEventListener(eventHandler.event, eventHandler.handler))
  instances.push(instance)
}

function update(el: HTMLElement, { value }: VNodeDirective) {
  const { handler, middleware, events } = processDirectiveArguments(value)
  const instance = instances.find((i: DirectiveInstance) => i.el === el)

  if (instance) {
    instance.eventHandlers.forEach((eventHandler: EventHandler) =>
      document.removeEventListener(eventHandler.event, eventHandler.handler),
    )

    instance.eventHandlers = events.map((eventName: string) => ({
      event: eventName,
      handler: (event: Event) => onEvent({ event, el, handler, middleware }),
    }))

    instance.eventHandlers.forEach((eventHandler: EventHandler) => document.addEventListener(eventHandler.event, eventHandler.handler))
  }
}

function unbind(el: HTMLElement) {
  const instance = instances.find((i: DirectiveInstance) => i.el === el)

  if (instance) {
    instance.eventHandlers.forEach(({ event, handler }) =>
      document.removeEventListener(event, handler),
    )
  }
}

const clickOuside = { bind, update, unbind, instances }

// Note: This is to disable the directive on server side, there should be a better way.
//       https://github.com/ndelvalle/v-click-outside/issues/22
export default (typeof window !== 'undefined' ? clickOuside : {})
