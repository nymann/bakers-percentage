import { type ReactNode } from 'react'
import { FeatureFlagContext } from './feature-flag-context'
import type { FeatureFlagService } from './application/ports/FeatureFlagPort'

export function FeatureFlagProvider({
  service,
  children,
}: {
  service: FeatureFlagService
  children: ReactNode
}) {
  return (
    <FeatureFlagContext value={service}>
      {children}
    </FeatureFlagContext>
  )
}
