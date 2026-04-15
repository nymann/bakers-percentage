import type { FeatureFlagService } from '../../application/ports/FeatureFlagPort'

export function createInMemoryFeatureFlags(
  flags: Record<string, boolean>,
): FeatureFlagService {
  return {
    isEnabled(flag: string): boolean {
      return flags[flag] ?? false
    },
  }
}
