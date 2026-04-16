import type { ActiveBake, FinishedBake } from '../../domain/Bake'
import type { PlanningPreferences } from '../../domain/PlanningPreferences'

export interface BakeStorage {
  readActive(): ActiveBake | null
  writeActive(bake: ActiveBake | null): void
  readHistory(): readonly FinishedBake[]
  writeHistory(history: readonly FinishedBake[]): void
  readPreferences(): PlanningPreferences | null
  writePreferences(preferences: PlanningPreferences): void
}
