import type { ActiveBake, FinishedBake } from '../../domain/Bake'
import type { PlanningPreferences } from '../../domain/PlanningPreferences'
import type { BakeStorage } from '../../application/ports/BakeStoragePort'

const ACTIVE_KEY = 'bakers-percentage:active-bake'
const HISTORY_KEY = 'bakers-percentage:bake-history'
const PREFERENCES_KEY = 'bakers-percentage:planning-preferences'
const CURRENT_VERSION = 1

type Envelope<T> = {
  version: number
  data: T
}

function readEnvelope<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Envelope<T>
    if (parsed.version !== CURRENT_VERSION) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeEnvelope<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return
  try {
    const envelope: Envelope<T> = { version: CURRENT_VERSION, data }
    window.localStorage.setItem(key, JSON.stringify(envelope))
  } catch {
    /* quota exceeded or storage unavailable — swallow */
  }
}

type StoredFinishedBake = Omit<FinishedBake, 'notes'> & { notes?: string }

function withNotesDefault(bakes: readonly StoredFinishedBake[]): readonly FinishedBake[] {
  return bakes.map((b) => ({ ...b, notes: b.notes ?? '' }))
}

export function createLocalStorageBakeStorage(): BakeStorage {
  return {
    readActive(): ActiveBake | null {
      return readEnvelope<ActiveBake | null>(ACTIVE_KEY) ?? null
    },
    writeActive(bake: ActiveBake | null): void {
      writeEnvelope(ACTIVE_KEY, bake)
    },
    readHistory(): readonly FinishedBake[] {
      return withNotesDefault(readEnvelope<readonly StoredFinishedBake[]>(HISTORY_KEY) ?? [])
    },
    writeHistory(history: readonly FinishedBake[]): void {
      writeEnvelope(HISTORY_KEY, history)
    },
    readPreferences(): PlanningPreferences | null {
      return readEnvelope<PlanningPreferences>(PREFERENCES_KEY) ?? null
    },
    writePreferences(preferences: PlanningPreferences): void {
      writeEnvelope(PREFERENCES_KEY, preferences)
    },
  }
}
