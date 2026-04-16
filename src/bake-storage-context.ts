import { createContext } from 'react'
import type { ActiveBake, FinishedBake } from './domain/Bake'

export interface BakeStorageValue {
  readonly active: ActiveBake | null
  readonly history: readonly FinishedBake[]
  readonly saveActive: (bake: ActiveBake | null) => void
  readonly saveHistory: (history: readonly FinishedBake[]) => void
}

export const BakeStorageContext = createContext<BakeStorageValue | null>(null)
