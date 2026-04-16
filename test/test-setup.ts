import '@testing-library/jest-dom/vitest'

function evaluateMediaQuery(query: string): boolean {
  const minWidth = /\(min-width:\s*(\d+)px\)/.exec(query)
  if (minWidth) return window.innerWidth >= Number(minWidth[1])
  const maxWidth = /\(max-width:\s*(\d+)px\)/.exec(query)
  if (maxWidth) return window.innerWidth <= Number(maxWidth[1])
  return false
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: evaluateMediaQuery(query),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
