import { CreateElement, VNode } from 'vue'

export type ListItemGenerator = (h: CreateElement, cca2: string, country: CountryInfo) => VNode

export interface CountryInfo {
  cca2: string
  name: {
    common: string
    official: string
    native?: string
  }
  flag: string
  callingCode?: string | number
}

export interface LookupResponse {
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

export type CountryCatalog = { [cca2: string]: CountryInfo }

export interface EventHandler {
  event: string
  handler: (event: Event) => void
}

export interface DirectiveInstance {
  el: HTMLElement
  eventHandlers: EventHandler[]
}

export type EventHandlerArgs = {
  el: Element
  event: any
  handler: (event: string, el: Element) => void
  middleware: any
}

export interface RippleProps {
  event: string
  transition: number
}

export declare class VuePhoneInput {
  public countries (): CountryCatalog
}

declare const vpi: VuePhoneInput

export default vpi
