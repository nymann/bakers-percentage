export interface ActiveBatch {
  readonly name: string
  readonly startedAt: Date
}

export interface UseActiveBatch {
  readonly batch: ActiveBatch | null
}

export function useActiveBatch(): UseActiveBatch {
  return { batch: null }
}
