import type { ReactElement, ReactNode } from 'react'
import { TestProviders, type TestProvidersOptions } from './helpers'

export function withTestProviders(
  options: TestProvidersOptions = {},
): (props: { children: ReactNode }) => ReactElement {
  return function Wrapper({ children }) {
    return <TestProviders {...options}>{children}</TestProviders>
  }
}
