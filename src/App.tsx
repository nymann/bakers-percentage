import { useMemo } from 'react'
import { FeatureFlagProvider } from './feature-flags'
import { createInMemoryFeatureFlags } from './adapters/driven/InMemoryFeatureFlags'
import { createLocalStorageBakeStorage } from './adapters/driven/LocalStorageBakeStorage'
import { BakeStorageProvider } from './bake-storage'
import { EditorialShell } from './adapters/driving/shell/EditorialShell'

const featureFlags = createInMemoryFeatureFlags({
  execution: true,
  history: true,
  twoStepPlanning: true,
})

export function AppContent() {
  return <EditorialShell />
}

export function App() {
  const storage = useMemo(() => createLocalStorageBakeStorage(), [])
  return (
    <FeatureFlagProvider service={featureFlags}>
      <BakeStorageProvider storage={storage}>
        <AppContent />
      </BakeStorageProvider>
    </FeatureFlagProvider>
  )
}
