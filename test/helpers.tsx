import type { ReactNode } from 'react'
import { FeatureFlagProvider } from '../src/feature-flags'
import { createInMemoryFeatureFlags } from '../src/adapters/driven/InMemoryFeatureFlags'
import { BakeStorageProvider } from '../src/bake-storage'
import {
  createInMemoryBakeStorage,
  type InMemoryBakeStorageSeed,
} from '../src/adapters/driven/InMemoryBakeStorage'
import type { BakeStorage } from '../src/application/ports/BakeStoragePort'

export interface TestProvidersOptions {
  flags?: Record<string, boolean>
  storage?: BakeStorage
  seed?: InMemoryBakeStorageSeed
}

export function TestProviders({
  children,
  flags = {},
  storage,
  seed,
}: TestProvidersOptions & { children: ReactNode }) {
  const bakeStorage = storage ?? createInMemoryBakeStorage(seed)
  const featureFlags = createInMemoryFeatureFlags(flags)
  return (
    <FeatureFlagProvider service={featureFlags}>
      <BakeStorageProvider storage={bakeStorage}>
        {children}
      </BakeStorageProvider>
    </FeatureFlagProvider>
  )
}
