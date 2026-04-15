export interface FeatureFlagService {
  isEnabled(flag: string): boolean
}
