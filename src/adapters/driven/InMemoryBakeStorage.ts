import type { ActiveBake, FinishedBake } from '../../domain/Bake'
import type { BakeStorage } from '../../application/ports/BakeStoragePort'

export interface InMemoryBakeStorageSeed {
  active?: ActiveBake | null
  history?: readonly FinishedBake[]
}

export function createInMemoryBakeStorage(
  seed: InMemoryBakeStorageSeed = {},
): BakeStorage {
  let active: ActiveBake | null = seed.active ?? null
  let history: readonly FinishedBake[] = seed.history ?? []

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
  }
}
