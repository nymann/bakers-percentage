import { useContext } from 'react'
import { FeatureFlagContext } from './feature-flag-context'

export function useFeatureFlag(flag: string): boolean {
  const service = useContext(FeatureFlagContext)
  if (!service) {
    throw new Error('useFeatureFlag must be used within a FeatureFlagProvider')
  }
  return service.isEnabled(flag)
}
