import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useActiveBatch } from '../../../src/application/use-cases/useActiveBatch'
import { withTestProviders } from '../../wrappers'
import type { ActiveBake } from '../../../src/domain/Bake'

const SAMPLE_RECIPE = {
  ingredients: [
    { name: 'Flour', grams: 500, percentage: 1 },
    { name: 'Water', grams: 375, percentage: 0.75 },
  ],
  totalDoughWeight: 900,
  finishedWeightPerLoaf: 900,
  loaves: 1,
  hydration: 0.75,
} as const

const NOW = new Date('2026-04-16T09:00:00.000Z')

function startInput() {
  return {
    name: 'Sourdough · 1 loaf · 900g',
    recipe: SAMPLE_RECIPE,
    schedule: [
      { name: 'Mix', timeMs: NOW.getTime() },
      { name: 'Shape', timeMs: NOW.getTime() + 6 * 3600_000 },
      { name: 'Bake', timeMs: NOW.getTime() + 8 * 3600_000 },
    ],
    checklistLabels: ['Fold 1', 'Fold 2'],
    now: NOW,
  }
}

describe('useActiveBatch: no active bake', () => {
  it('returns a null batch by default', () => {
    const { result } = renderHook(() => useActiveBatch(), {
      wrapper: withTestProviders(),
    })
    expect(result.current.batch).toBeNull()
    expect(result.current.progress).toEqual([])
  })
})

describe('useActiveBatch: starting a bake', () => {
  it('populates the batch from the snapshot', () => {
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders(),
    })

    act(() => result.current.startBake(startInput()))

    expect(result.current.batch?.name).toBe('Sourdough · 1 loaf · 900g')
    expect(result.current.batch?.schedule).toHaveLength(3)
    expect(result.current.batch?.checklist).toEqual([
      { label: 'Fold 1', checked: false },
      { label: 'Fold 2', checked: false },
    ])
  })

  it('marks the first schedule event as current when now matches its time', () => {
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders(),
    })

    act(() => result.current.startBake(startInput()))

    const statuses = result.current.progress.map((p) => p.status)
    expect(statuses).toEqual(['current', 'upcoming', 'upcoming'])
  })
})

describe('useActiveBatch: checklist persistence', () => {
  it('toggles a checklist item', () => {
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders(),
    })

    act(() => result.current.startBake(startInput()))
    act(() => result.current.toggleChecklist(0))

    expect(result.current.batch?.checklist[0]?.checked).toBe(true)
    expect(result.current.batch?.checklist[1]?.checked).toBe(false)
  })
})

describe('useActiveBatch: finishing a bake', () => {
  it('clears the active batch and appends to history', () => {
    const wrapper = withTestProviders()
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), { wrapper })

    act(() => result.current.startBake(startInput()))

    const finishedAt = new Date(NOW.getTime() + 9 * 3600_000)
    act(() => result.current.finishBake(finishedAt))

    expect(result.current.batch).toBeNull()
  })
})

describe('useActiveBatch: seeded active bake', () => {
  it('reads a pre-existing active bake from storage', () => {
    const seeded: ActiveBake = {
      id: 'bake-1',
      name: 'Existing bake',
      startedAtMs: NOW.getTime(),
      recipe: SAMPLE_RECIPE,
      schedule: [{ name: 'Bake', timeMs: NOW.getTime() + 3600_000 }],
      checklist: [{ label: 'Shape', checked: true }],
    }
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders({ seed: { active: seeded } }),
    })

    expect(result.current.batch?.name).toBe('Existing bake')
    expect(result.current.batch?.checklist[0]?.checked).toBe(true)
  })
})
