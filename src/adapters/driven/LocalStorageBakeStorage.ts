import type { ActiveBake, FinishedBake } from '../../domain/Bake'
import type { BakeStorage } from '../../application/ports/BakeStoragePort'

const ACTIVE_KEY = 'bakers-percentage:active-bake'
const HISTORY_KEY = 'bakers-percentage:bake-history'
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

export function createLocalStorageBakeStorage(): BakeStorage {
  return {
    readActive(): ActiveBake | null {
      return readEnvelope<ActiveBake | null>(ACTIVE_KEY) ?? null
    },
    writeActive(bake: ActiveBake | null): void {
      writeEnvelope(ACTIVE_KEY, bake)
    },
    readHistory(): readonly FinishedBake[] {
      return readEnvelope<readonly FinishedBake[]>(HISTORY_KEY) ?? []
    },
    writeHistory(history: readonly FinishedBake[]): void {
      writeEnvelope(HISTORY_KEY, history)
    },
  }
}
