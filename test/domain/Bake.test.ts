import { describe, it, expect } from 'vitest'
import {
  completeBake,
  focusSteps,
  formatRelative,
  relativeTo,
  scheduleProgress,
  toggleChecklistItem,
  toggleEventCompletion,
  type ActiveBake,
} from '../../src/domain/Bake'

const START = Date.parse('2026-04-16T09:00:00.000Z')
const ONE_HOUR = 60 * 60_000
const EVENTS = [
  { name: 'Mix', timeMs: START },
  { name: 'Shape', timeMs: START + 6 * 3600_000 },
  { name: 'Bake', timeMs: START + 8 * 3600_000 },
]

describe('scheduleProgress', () => {
  it('marks the first event as current when none are completed', () => {
    const result = scheduleProgress(EVENTS)
    expect(result.map((r) => r.status)).toEqual(['current', 'upcoming', 'upcoming'])
  })

  it('advances current past completed events', () => {
    const result = scheduleProgress(EVENTS, [0])
    expect(result.map((r) => r.status)).toEqual(['done', 'current', 'upcoming'])
  })

  it('marks the final event as current once all prior are completed', () => {
    const result = scheduleProgress(EVENTS, [0, 1])
    expect(result.map((r) => r.status)).toEqual(['done', 'done', 'current'])
  })

  it('allows out-of-order completion (e.g. step 2 done before step 1)', () => {
    const result = scheduleProgress(EVENTS, [1])
    expect(result.map((r) => r.status)).toEqual(['current', 'done', 'upcoming'])
  })

  it('returns an empty array for an empty schedule', () => {
    expect(scheduleProgress([])).toEqual([])
  })
})

describe('toggleEventCompletion', () => {
  it('adds an index that was not previously completed', () => {
    expect(toggleEventCompletion([], 2)).toEqual([2])
  })

  it('removes an index that was already completed', () => {
    expect(toggleEventCompletion([1, 2, 3], 2)).toEqual([1, 3])
  })

  it('keeps the completed list sorted', () => {
    expect(toggleEventCompletion([3, 1], 2)).toEqual([1, 2, 3])
  })
})

describe('toggleChecklistItem', () => {
  it('flips the checked flag at the given index', () => {
    const next = toggleChecklistItem(
      [
        { label: 'A', checked: false },
        { label: 'B', checked: false },
      ],
      1,
    )
    expect(next[0]?.checked).toBe(false)
    expect(next[1]?.checked).toBe(true)
  })
})

describe('relativeTo + formatRelative', () => {
  it('renders a future delta over an hour with h m s components', () => {
    const target = START + 2 * ONE_HOUR + 34 * 60_000 + 7_000
    expect(formatRelative(relativeTo(target, START))).toBe('in 2h 34m 7s')
  })

  it('renders a past delta under an hour with m s components', () => {
    const target = START - (45 * 60_000 + 12_000)
    expect(formatRelative(relativeTo(target, START))).toBe('45m 12s ago')
  })

  it('renders sub-minute future deltas as just seconds', () => {
    expect(formatRelative(relativeTo(START + 42_000, START))).toBe('in 42s')
  })

  it('renders sub-minute past deltas as just seconds', () => {
    expect(formatRelative(relativeTo(START - 42_000, START))).toBe('42s ago')
  })

  it('renders "now" when within a second of now', () => {
    expect(formatRelative(relativeTo(START, START))).toBe('now')
    expect(formatRelative(relativeTo(START + 500, START))).toBe('now')
  })

  it('shows zero seconds at exact minute or hour boundaries', () => {
    expect(formatRelative(relativeTo(START + 3 * ONE_HOUR, START))).toBe('in 3h 0m 0s')
    expect(formatRelative(relativeTo(START + 45 * 60_000, START))).toBe('in 45m 0s')
  })
})

describe('focusSteps', () => {
  const THRESHOLD = 10 * 60_000 // 10 min

  it('returns empty for an empty progress', () => {
    expect(focusSteps([], THRESHOLD)).toEqual([])
  })

  it('returns the current step and the next upcoming regardless of gap', () => {
    const progress = scheduleProgress(EVENTS)
    const result = focusSteps(progress, THRESHOLD)
    expect(result.map((s) => s.event.name)).toEqual(['Mix', 'Shape'])
  })

  it('extends the window while subsequent upcoming events stay within threshold', () => {
    const events = [
      { name: 'Mix', timeMs: START },
      { name: 'Fold 1', timeMs: START + 30 * 60_000 },
      { name: 'Fold 2', timeMs: START + 35 * 60_000 },
      { name: 'Fold 3', timeMs: START + 40 * 60_000 },
      { name: 'Shape', timeMs: START + 6 * 3600_000 },
    ]
    const progress = scheduleProgress(events)
    const result = focusSteps(progress, THRESHOLD)
    expect(result.map((s) => s.event.name)).toEqual([
      'Mix',
      'Fold 1',
      'Fold 2',
      'Fold 3',
    ])
  })

  it('stops extending at the first gap larger than the threshold', () => {
    const events = [
      { name: 'Mix', timeMs: START },
      { name: 'Fold 1', timeMs: START + 30 * 60_000 },
      { name: 'Shape', timeMs: START + 6 * 3600_000 },
    ]
    const progress = scheduleProgress(events)
    const result = focusSteps(progress, THRESHOLD)
    expect(result.map((s) => s.event.name)).toEqual(['Mix', 'Fold 1'])
  })

  it('returns just the final step when all prior steps are completed', () => {
    const progress = scheduleProgress(EVENTS, [0, 1])
    const result = focusSteps(progress, THRESHOLD)
    expect(result.map((s) => s.event.name)).toEqual(['Bake'])
  })
})

describe('completeBake', () => {
  it('stamps finishedAtMs on the active bake', () => {
    const active: ActiveBake = {
      id: 'a',
      name: 'Test',
      startedAtMs: START,
      recipe: {
        ingredients: [],
        totalDoughWeight: 0,
        finishedWeightPerLoaf: 0,
        loaves: 1,
        hydration: 0.75,
      },
      schedule: EVENTS,
      checklist: [],
    }
    const finished = completeBake(active, START + 9 * 3600_000)
    expect(finished.finishedAtMs).toBe(START + 9 * 3600_000)
    expect(finished.id).toBe('a')
  })
})
