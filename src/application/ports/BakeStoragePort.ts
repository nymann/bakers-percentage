import type { ActiveBake, FinishedBake } from '../../domain/Bake'

export interface BakeStorage {
  readActive(): ActiveBake | null
  writeActive(bake: ActiveBake | null): void
  readHistory(): readonly FinishedBake[]
  writeHistory(history: readonly FinishedBake[]): void
}
