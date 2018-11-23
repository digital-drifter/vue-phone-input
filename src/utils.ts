const getLanguage: (() => string) = () => {
  if (navigator.languages) {
    switch (true) {
      case !!(navigator as any).browserLanguage:
        return (navigator as any).browserLanguage
      case !!(navigator as any).language:
        return (navigator as any).language
      case !!(navigator as any).languages:
        return (navigator as any).languages
      case !!(navigator as any).userLanguage:
        return (navigator as any).userLanguage
      default:
        return 'en_US'
    }
  }
}

export { getLanguage }
