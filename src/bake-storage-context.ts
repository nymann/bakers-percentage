import { createContext } from 'react'
import type { ActiveBake, FinishedBake } from './domain/Bake'
import type { PlanningPreferences } from './domain/PlanningPreferences'

export interface BakeStorageValue {
  readonly active: ActiveBake | null
  readonly history: readonly FinishedBake[]
  readonly preferences: PlanningPreferences | null
  readonly saveActive: (bake: ActiveBake | null) => void
  readonly saveHistory: (history: readonly FinishedBake[]) => void
  readonly savePreferences: (preferences: PlanningPreferences) => void
}

export const BakeStorageContext = createContext<BakeStorageValue | null>(null)
