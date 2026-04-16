import { FeatureFlagProvider } from './feature-flags'
import { createInMemoryFeatureFlags } from './adapters/driven/InMemoryFeatureFlags'
import { EditorialShell } from './adapters/driving/shell/EditorialShell'

const featureFlags = createInMemoryFeatureFlags({})

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
