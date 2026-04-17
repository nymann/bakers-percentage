import type { OvenType } from './Oven'
import type { PlanningPreferences } from './PlanningPreferences'

export type Milliseconds = number

export type BakeScheduleEvent = {
  readonly name: string
  readonly timeMs: Milliseconds
}

export type BakeIngredient = {
  readonly name: string
  readonly grams: number
  readonly percentage: number
}

export type RecipeSnapshot = {
  readonly ingredients: readonly BakeIngredient[]
  readonly totalDoughWeight: number
  readonly finishedWeightPerLoaf: number
  readonly loaves: number
  readonly hydration: number
}

export type ChecklistItem = {
  readonly label: string
  readonly checked: boolean
  readonly phase?: string
}

export type ActiveBake = {
  readonly id: string
  readonly name: string
  readonly startedAtMs: Milliseconds
  readonly recipe: RecipeSnapshot
  readonly schedule: readonly BakeScheduleEvent[]
  readonly checklist: readonly ChecklistItem[]
  readonly preferences?: PlanningPreferences
  readonly ovenType?: OvenType
  readonly preheatMinutes?: number
  readonly completedEventIndices?: readonly number[]
}

export type FinishedBake = ActiveBake & {
  readonly finishedAtMs: Milliseconds
  readonly notes: string
}

export type ProgressStatus = 'done' | 'current' | 'upcoming'

export type ProgressStep = {
  readonly event: BakeScheduleEvent
  readonly status: ProgressStatus
  readonly index: number
}

export function focusSteps(
  progress: readonly ProgressStep[],
  thresholdMs: Milliseconds,
): readonly ProgressStep[] {
  if (progress.length === 0) return []

  const currentIdx = progress.findIndex((p) => p.status === 'current')
  const firstUpcomingIdx = progress.findIndex((p) => p.status === 'upcoming')
  const anchorIdx = currentIdx >= 0 ? currentIdx : firstUpcomingIdx
  if (anchorIdx < 0) return []

  const focus: ProgressStep[] = [progress[anchorIdx]!]
  let prev = progress[anchorIdx]!

  for (let i = anchorIdx + 1; i < progress.length; i++) {
    const step = progress[i]!
    const isFirstAfterAnchor = focus.length === 1
    const withinThreshold = step.event.timeMs - prev.event.timeMs <= thresholdMs
    if (isFirstAfterAnchor || withinThreshold) {
      focus.push(step)
      prev = step
      continue
    }
    break
  }
  return focus
}

export function scheduleProgress(
  schedule: readonly BakeScheduleEvent[],
  completedIndices: readonly number[] = [],
): readonly ProgressStep[] {
  const completed = new Set(completedIndices)
  const firstIncompleteIdx = schedule.findIndex((_, i) => !completed.has(i))
  return schedule.map((event, i) => {
    if (completed.has(i)) return { event, status: 'done' as const, index: i }
    if (i === firstIncompleteIdx)
      return { event, status: 'current' as const, index: i }
    return { event, status: 'upcoming' as const, index: i }
  })
}

export function toggleEventCompletion(
  completed: readonly number[],
  index: number,
): readonly number[] {
  const set = new Set(completed)
  if (set.has(index)) set.delete(index)
  else set.add(index)
  return [...set].sort((a, b) => a - b)
}

export function toggleChecklistItem(
  checklist: readonly ChecklistItem[],
  index: number,
): readonly ChecklistItem[] {
  return checklist.map((item, i) =>
    i === index ? { ...item, checked: !item.checked } : item,
  )
}

export function completeBake(
  active: ActiveBake,
  finishedAtMs: Milliseconds,
): FinishedBake {
  return { ...active, finishedAtMs, notes: '' }
}

export type RelativeTime = {
  readonly deltaMs: Milliseconds
  readonly direction: 'future' | 'past' | 'now'
}

export function relativeTo(
  targetMs: Milliseconds,
  nowMs: Milliseconds,
): RelativeTime {
  const deltaMs = targetMs - nowMs
  if (deltaMs === 0) return { deltaMs: 0, direction: 'now' }
  return {
    deltaMs: Math.abs(deltaMs),
    direction: deltaMs > 0 ? 'future' : 'past',
  }
}

export function formatRelative(relative: RelativeTime): string {
  if (relative.direction === 'now' || relative.deltaMs < 1_000) return 'now'
  const body = formatDeltaBody(relative.deltaMs)
  return relative.direction === 'future' ? `in ${body}` : `${body} ago`
}

function formatDeltaBody(deltaMs: Milliseconds): string {
  const totalSeconds = Math.floor(deltaMs / 1_000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}
