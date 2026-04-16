import type { ActiveBake, FinishedBake } from '../../domain/Bake'
import type { PlanningPreferences } from '../../domain/PlanningPreferences'
import type { BakeStorage } from '../../application/ports/BakeStoragePort'

export interface InMemoryBakeStorageSeed {
  active?: ActiveBake | null
  history?: readonly FinishedBake[]
  preferences?: PlanningPreferences | null
}

export function createInMemoryBakeStorage(
  seed: InMemoryBakeStorageSeed = {},
): BakeStorage {
  let active: ActiveBake | null = seed.active ?? null
  let history: readonly FinishedBake[] = seed.history ?? []
  let preferences: PlanningPreferences | null = seed.preferences ?? null

  return {
    readActive(): ActiveBake | null {
      return active
    },
    writeActive(bake: ActiveBake | null): void {
      active = bake
    },
    readHistory(): readonly FinishedBake[] {
      return history
    },
    writeHistory(next: readonly FinishedBake[]): void {
      history = next
    },
    readPreferences(): PlanningPreferences | null {
      return preferences
    },
    writePreferences(next: PlanningPreferences): void {
      preferences = next
    },
  }
}
