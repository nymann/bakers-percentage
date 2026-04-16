import { FeatureFlagProvider } from './feature-flags'
import { createInMemoryFeatureFlags } from './adapters/driven/InMemoryFeatureFlags'
import { EditorialShell } from './adapters/driving/shell/EditorialShell'

const featureFlags = createInMemoryFeatureFlags({
  'yeast-recipe-calculator': true,
  'hydration-preset': true,
  'validate-basic-inputs': true,
  'manual-starter-percent': true,
  'fermentation-zone-feedback': true,
  'auto-recommend-starter-percent': true,
  'baking-schedule': true,
  'visual-timeline': true,
  'execution-view': true,
  'history-view': true,
})

export function AppContent() {
  return <EditorialShell />
}

export function App() {
  return (
    <FeatureFlagProvider service={featureFlags}>
      <AppContent />
    </FeatureFlagProvider>
  )
}
