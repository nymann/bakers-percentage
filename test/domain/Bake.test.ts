import { describe, it, expect } from 'vitest'
import {
  completeBake,
  formatRelative,
  relativeTo,
  scheduleProgress,
  toggleChecklistItem,
  type ActiveBake,
} from '../../src/domain/Bake'

const START = Date.parse('2026-04-16T09:00:00.000Z')
const EVENTS = [
  { name: 'Mix', timeMs: START },
  { name: 'Shape', timeMs: START + 6 * 3600_000 },
  { name: 'Bake', timeMs: START + 8 * 3600_000 },
]

describe('scheduleProgress', () => {
  it('marks all events as upcoming when now is before the first', () => {
    const result = scheduleProgress(EVENTS, START - 1)
    expect(result.map((r) => r.status)).toEqual(['upcoming', 'upcoming', 'upcoming'])
  })

  it('marks the most recent event as current', () => {
    const result = scheduleProgress(EVENTS, START + 6 * 3600_000 + 1_000)
    expect(result.map((r) => r.status)).toEqual(['done', 'current', 'upcoming'])
  })

  it('marks the final event as current after its time', () => {
    const result = scheduleProgress(EVENTS, START + 9 * 3600_000)
    expect(result.map((r) => r.status)).toEqual(['done', 'done', 'current'])
  })

  it('returns an empty array for an empty schedule', () => {
    expect(scheduleProgress([], START)).toEqual([])
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
  it('renders a future delta as "in Xh Ym"', () => {
    const target = START + (2 * 60 + 34) * 60_000
    expect(formatRelative(relativeTo(target, START))).toBe('in 2h 34m')
  })

  it('renders a past delta as "Xh Ym ago"', () => {
    const target = START - 45 * 60_000
    expect(formatRelative(relativeTo(target, START))).toBe('45m ago')
  })

  it('renders "now" when target equals now', () => {
    expect(formatRelative(relativeTo(START, START))).toBe('now')
  })

  it('rounds sub-minute deltas', () => {
    expect(formatRelative(relativeTo(START + 20_000, START))).toBe('in <1m')
    expect(formatRelative(relativeTo(START - 20_000, START))).toBe('just now')
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
