import { createContext, useContext, type ReactNode } from 'react'
import type { FeatureFlagService } from './application/ports/FeatureFlagPort'

const FeatureFlagContext = createContext<FeatureFlagService | null>(null)

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

export function useFeatureFlag(flag: string): boolean {
  const service = useContext(FeatureFlagContext)
  if (!service) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider')
  }
  return service.isEnabled(flag)
}
