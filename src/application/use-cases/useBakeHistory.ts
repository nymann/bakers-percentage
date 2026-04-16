import { useCallback, useMemo, useState } from 'react'
import type { FinishedBake } from '../../domain/Bake'
import { useBakeStorageValue } from '../../use-bake-storage'

export interface UseBakeHistory {
  readonly bakes: readonly FinishedBake[]
  readonly isEmpty: boolean
  readonly selected: FinishedBake | null
  readonly select: (id: string) => void
  readonly clearSelection: () => void
  readonly remove: (id: string) => void
}

export function useBakeHistory(): UseBakeHistory {
  const { history, saveHistory } = useBakeStorageValue()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = useMemo<FinishedBake | null>(
    () => history.find((bake) => bake.id === selectedId) ?? null,
    [history, selectedId],
  )

  const select = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedId(null)
  }, [])

  const remove = useCallback(
    (id: string) => {
      saveHistory(history.filter((bake) => bake.id !== id))
      setSelectedId((current) => (current === id ? null : current))
    },
    [history, saveHistory],
  )

  return {
    bakes: history,
    isEmpty: history.length === 0,
    selected,
    select,
    clearSelection,
    remove,
  }
}
