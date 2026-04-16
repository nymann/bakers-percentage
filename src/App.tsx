import { FeatureFlagProvider } from './feature-flags'
import { createInMemoryFeatureFlags } from './adapters/driven/InMemoryFeatureFlags'
import { RecipeCalculator } from './adapters/driving/planning/RecipeCalculator'
import { EditorialShell } from './adapters/driving/shell/EditorialShell'
import { useFeatureFlag } from './use-feature-flag'

const featureFlags = createInMemoryFeatureFlags({
  'yeast-recipe-calculator': true,
  'hydration-preset': true,
  'validate-basic-inputs': true,
  'manual-starter-percent': true,
  'fermentation-zone-feedback': true,
  'auto-recommend-starter-percent': true,
  'baking-schedule': true,
  'visual-timeline': true,
  'editorial-shell': false,
  'editorial-planning': true,
  'execution-view': false,
  'history-view': false,
})

export function AppContent() {
  const shellEnabled = useFeatureFlag('editorial-shell')
  return shellEnabled ? <EditorialShell /> : <RecipeCalculator />
}

export function App() {
  return (
    <FeatureFlagProvider service={featureFlags}>
      <AppContent />
    </FeatureFlagProvider>
  )
}
