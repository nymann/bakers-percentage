import { useCallback, useMemo } from 'react'
import {
  completeBake,
  focusSteps as computeFocusSteps,
  scheduleProgress,
  toggleChecklistItem,
  toggleEventCompletion,
  type ActiveBake,
  type BakeScheduleEvent,
  type ChecklistItem,
  type ProgressStep,
  type RecipeSnapshot,
} from '../../domain/Bake'
import type { OvenType } from '../../domain/Oven'
import {
  DEFAULT_PLANNING_PREFERENCES,
  type PlanningPreferences,
} from '../../domain/PlanningPreferences'
import { useBakeStorageValue } from '../../use-bake-storage'

export type ChecklistSeed =
  | string
  | { readonly label: string; readonly phase?: string }

export interface StartBakeInput {
  readonly name: string
  readonly recipe: RecipeSnapshot
  readonly schedule: readonly BakeScheduleEvent[]
  readonly checklistLabels: readonly ChecklistSeed[]
  readonly preferences?: PlanningPreferences
  readonly now: Date
}

export type ChecklistEntry = {
  readonly item: ChecklistItem
  readonly index: number
}

export interface UseActiveBatch {
  readonly batch: ActiveBake | null
  readonly progress: readonly ProgressStep[]
  readonly focusSteps: readonly ProgressStep[]
  readonly checklistByPhase: ReadonlyMap<string, readonly ChecklistEntry[]>
  readonly bakePhaseStarted: boolean
  readonly startBake: (input: StartBakeInput) => void
  readonly toggleChecklist: (index: number) => void
  readonly toggleEventCompletion: (index: number) => void
  readonly selectOvenType: (type: OvenType) => void
  readonly changePreheatMinutes: (minutes: number) => void
  readonly finishBake: (finishedAt: Date) => void
  readonly discardBake: () => void
}

export interface UseActiveBatchOptions {
  readonly now?: Date
}

function initialChecklist(
  seeds: readonly ChecklistSeed[],
): readonly ChecklistItem[] {
  return seeds.map((seed) =>
    typeof seed === 'string'
      ? { label: seed, checked: false }
      : { label: seed.label, checked: false, phase: seed.phase },
  )
}

function newId(startedAtMs: number): string {
  return `bake-${startedAtMs.toString(36)}`
}

function groupChecklistByPhase(
  checklist: readonly ChecklistItem[],
): ReadonlyMap<string, readonly ChecklistEntry[]> {
  const map = new Map<string, ChecklistEntry[]>()
  checklist.forEach((item, index) => {
    const phase = item.phase
    if (!phase) return
    const bucket = map.get(phase) ?? []
    bucket.push({ item, index })
    map.set(phase, bucket)
  })
  return map
}

const FOCUS_CLUSTER_THRESHOLD_MS = 10 * 60_000

function finalEventStarted(progress: readonly ProgressStep[]): boolean {
  if (progress.length === 0) return false
  const last = progress[progress.length - 1]!
  return last.status !== 'upcoming'
}

export function useActiveBatch(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options: UseActiveBatchOptions = {},
): UseActiveBatch {
  const { active, history, preferences, saveActive, saveHistory, savePreferences } =
    useBakeStorageValue()

  const progress = useMemo(
    () =>
      active
        ? scheduleProgress(active.schedule, active.completedEventIndices ?? [])
        : [],
    [active],
  )

  const focusSteps = useMemo(
    () => computeFocusSteps(progress, FOCUS_CLUSTER_THRESHOLD_MS),
    [progress],
  )

  const checklistByPhase = useMemo(
    () => groupChecklistByPhase(active?.checklist ?? []),
    [active?.checklist],
  )

  const bakePhaseStarted = finalEventStarted(progress)

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
        ovenType: preferences?.ovenType,
        preheatMinutes: preferences?.preheatMinutes,
      }
      saveActive(bake)
    },
    [preferences, saveActive],
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

  const toggleEventCompletionAt = useCallback(
    (index: number) => {
      if (!active) return
      saveActive({
        ...active,
        completedEventIndices: toggleEventCompletion(
          active.completedEventIndices ?? [],
          index,
        ),
      })
    },
    [active, saveActive],
  )

  const persistPreference = useCallback(
    (patch: Partial<PlanningPreferences>) => {
      const base = preferences ?? active?.preferences ?? DEFAULT_PLANNING_PREFERENCES
      savePreferences({ ...base, ...patch })
    },
    [preferences, active?.preferences, savePreferences],
  )

  const selectOvenType = useCallback(
    (type: OvenType) => {
      if (active) {
        saveActive({ ...active, ovenType: type })
      }
      persistPreference({ ovenType: type })
    },
    [active, saveActive, persistPreference],
  )

  const changePreheatMinutes = useCallback(
    (minutes: number) => {
      if (active) {
        saveActive({ ...active, preheatMinutes: minutes })
      }
      persistPreference({ preheatMinutes: minutes })
    },
    [active, saveActive, persistPreference],
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
    focusSteps,
    checklistByPhase,
    bakePhaseStarted,
    startBake,
    toggleChecklist,
    toggleEventCompletion: toggleEventCompletionAt,
    selectOvenType,
    changePreheatMinutes,
    finishBake,
    discardBake,
  }
}
