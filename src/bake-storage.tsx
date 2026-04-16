import { useCallback, useMemo, useState, type ReactNode } from 'react'
import {
  BakeStorageContext,
  type BakeStorageValue,
} from './bake-storage-context'
import type { BakeStorage } from './application/ports/BakeStoragePort'
import type { ActiveBake, FinishedBake } from './domain/Bake'

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

  const value = useMemo<BakeStorageValue>(
    () => ({ active, history, saveActive, saveHistory }),
    [active, history, saveActive, saveHistory],
  )

  return (
    <BakeStorageContext value={value}>{children}</BakeStorageContext>
  )
}
