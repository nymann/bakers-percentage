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
}

export type ActiveBake = {
  readonly id: string
  readonly name: string
  readonly startedAtMs: Milliseconds
  readonly recipe: RecipeSnapshot
  readonly schedule: readonly BakeScheduleEvent[]
  readonly checklist: readonly ChecklistItem[]
  readonly preferences?: PlanningPreferences
}

export type FinishedBake = ActiveBake & {
  readonly finishedAtMs: Milliseconds
  readonly notes: string
}

export type ProgressStatus = 'done' | 'current' | 'upcoming'

export type ProgressStep = {
  readonly event: BakeScheduleEvent
  readonly status: ProgressStatus
}

export function scheduleProgress(
  schedule: readonly BakeScheduleEvent[],
  nowMs: Milliseconds,
): readonly ProgressStep[] {
  let currentIdx = -1
  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i]!.timeMs <= nowMs) currentIdx = i
  }
  return schedule.map((event, i) => {
    if (i < currentIdx) return { event, status: 'done' as const }
    if (i === currentIdx) return { event, status: 'current' as const }
    return { event, status: 'upcoming' as const }
  })
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
  if (relative.direction === 'now') return 'now'
  const totalMinutes = Math.round(relative.deltaMs / 60_000)
  if (totalMinutes < 1) {
    return relative.direction === 'future' ? 'in <1m' : 'just now'
  }
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const parts: string[] = []
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  const body = parts.join(' ')
  return relative.direction === 'future' ? `in ${body}` : `${body} ago`
}
