import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  BakeStorageContext,
  type BakeStorageValue,
} from './bake-storage-context'
import type { BakeStorage } from './application/ports/BakeStoragePort'
import type { ActiveBake, FinishedBake } from './domain/Bake'
import type { PlanningPreferences } from './domain/PlanningPreferences'

export function BakeStorageProvider({
  storage,
  children,
}: {
  storage: BakeStorage
  children: ReactNode
}) {
  const [active, setActive] = useState<ActiveBake | null>(() =>
    storage.readActive(),
  )
  const [history, setHistory] = useState<readonly FinishedBake[]>(() =>
    storage.readHistory(),
  )
  const [preferences, setPreferences] = useState<PlanningPreferences | null>(
    () => storage.readPreferences(),
  )

  const saveActive = useCallback(
    (bake: ActiveBake | null) => {
      storage.writeActive(bake)
      setActive(bake)
    },
    [storage],
  )

  const saveHistory = useCallback(
    (next: readonly FinishedBake[]) => {
      storage.writeHistory(next)
      setHistory(next)
    },
    [storage],
  )

  const savePreferences = useCallback(
    (next: PlanningPreferences) => {
      storage.writePreferences(next)
      setPreferences(next)
    },
    [storage],
  )

  const value = useMemo<BakeStorageValue>(
    () => ({
      active,
      history,
      preferences,
      saveActive,
      saveHistory,
      savePreferences,
    }),
    [active, history, preferences, saveActive, saveHistory, savePreferences],
  )

  return (
    <BakeStorageContext value={value}>{children}</BakeStorageContext>
  )
}
