import { useCallback, useMemo } from 'react'
import {
  completeBake,
  scheduleProgress,
  toggleChecklistItem,
  type ActiveBake,
  type BakeScheduleEvent,
  type ChecklistItem,
  type ProgressStep,
  type RecipeSnapshot,
} from '../../domain/Bake'
import type { PlanningPreferences } from '../../domain/PlanningPreferences'
import { useBakeStorageValue } from '../../use-bake-storage'

export interface StartBakeInput {
  readonly name: string
  readonly recipe: RecipeSnapshot
  readonly schedule: readonly BakeScheduleEvent[]
  readonly checklistLabels: readonly string[]
  readonly preferences?: PlanningPreferences
  readonly now: Date
}

export interface UseActiveBatch {
  readonly batch: ActiveBake | null
  readonly progress: readonly ProgressStep[]
  readonly startBake: (input: StartBakeInput) => void
  readonly toggleChecklist: (index: number) => void
  readonly finishBake: (finishedAt: Date) => void
  readonly discardBake: () => void
}

export interface UseActiveBatchOptions {
  readonly now?: Date
}

function initialChecklist(labels: readonly string[]): readonly ChecklistItem[] {
  return labels.map((label) => ({ label, checked: false }))
}

function newId(startedAtMs: number): string {
  return `bake-${startedAtMs.toString(36)}`
}

export function useActiveBatch(
  options: UseActiveBatchOptions = {},
): UseActiveBatch {
  const { active, history, saveActive, saveHistory } = useBakeStorageValue()
  const nowMs = (options.now ?? new Date()).getTime()

  const progress = useMemo(
    () => (active ? scheduleProgress(active.schedule, nowMs) : []),
    [active, nowMs],
  )

  const startBake = useCallback(
    (input: StartBakeInput) => {
      const startedAtMs = input.now.getTime()
      const bake: ActiveBake = {
        id: newId(startedAtMs),
        name: input.name,
        startedAtMs,
        recipe: input.recipe,
        schedule: input.schedule,
        checklist: initialChecklist(input.checklistLabels),
        preferences: input.preferences,
      }
      saveActive(bake)
    },
    [saveActive],
  )

  const toggleChecklist = useCallback(
    (index: number) => {
      if (!active) return
      saveActive({
        ...active,
        checklist: toggleChecklistItem(active.checklist, index),
      })
    },
    [active, saveActive],
  )

  const finishBake = useCallback(
    (finishedAt: Date) => {
      if (!active) return
      const finished = completeBake(active, finishedAt.getTime())
      saveHistory([finished, ...history])
      saveActive(null)
    },
    [active, history, saveActive, saveHistory],
  )

  const discardBake = useCallback(() => {
    saveActive(null)
  }, [saveActive])

  return {
    batch: active,
    progress,
    startBake,
    toggleChecklist,
    finishBake,
    discardBake,
  }
}
