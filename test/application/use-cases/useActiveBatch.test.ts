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

describe('useActiveBatch: oven type selection', () => {
  it('stores the selected oven type on the active bake', () => {
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders(),
    })

    act(() => result.current.startBake(startInput()))
    act(() => result.current.selectOvenType('dutch-oven'))

    expect(result.current.batch?.ovenType).toBe('dutch-oven')
  })

  it('seeds oven type from user preferences on a new bake', () => {
    const wrapper = withTestProviders()
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), { wrapper })

    act(() => result.current.startBake(startInput()))
    act(() => result.current.selectOvenType('stone-steel'))
    act(() => result.current.finishBake(new Date(NOW.getTime() + 3600_000)))
    act(() => result.current.startBake(startInput()))

    expect(result.current.batch?.ovenType).toBe('stone-steel')
  })
})

describe('useActiveBatch: preheat minutes', () => {
  it('stores preheat minutes on the active bake', () => {
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders(),
    })

    act(() => result.current.startBake(startInput()))
    act(() => result.current.changePreheatMinutes(40))

    expect(result.current.batch?.preheatMinutes).toBe(40)
  })

  it('seeds preheat minutes from preferences on a new bake', () => {
    const wrapper = withTestProviders()
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), { wrapper })

    act(() => result.current.startBake(startInput()))
    act(() => result.current.changePreheatMinutes(55))
    act(() => result.current.finishBake(new Date(NOW.getTime() + 3600_000)))
    act(() => result.current.startBake(startInput()))

    expect(result.current.batch?.preheatMinutes).toBe(55)
  })
})

describe('useActiveBatch: bake phase derivations', () => {
  it('reports bakePhaseStarted as false before the final event is reached', () => {
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders(),
    })

    act(() => result.current.startBake(startInput()))

    expect(result.current.bakePhaseStarted).toBe(false)
  })

  it('reports bakePhaseStarted as true once all prior events are completed', () => {
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders(),
    })

    act(() => result.current.startBake(startInput()))
    act(() => result.current.toggleEventCompletion(0))
    act(() => result.current.toggleEventCompletion(1))

    expect(result.current.bakePhaseStarted).toBe(true)
  })

  it('groups checklist entries by phase', () => {
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders(),
    })

    act(() =>
      result.current.startBake({
        ...startInput(),
        checklistLabels: [
          { label: 'Fold 1', phase: 'Mix & bulk fermentation' },
          { label: 'Fold 2', phase: 'Mix & bulk fermentation' },
          { label: 'Score', phase: 'Bake' },
        ],
      }),
    )

    const byPhase = result.current.checklistByPhase
    expect(byPhase.get('Mix & bulk fermentation')?.map((e) => e.item.label))
      .toEqual(['Fold 1', 'Fold 2'])
    expect(byPhase.get('Bake')?.map((e) => e.item.label)).toEqual(['Score'])
  })

  it('toggles a schedule event completion and advances current', () => {
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders(),
    })

    act(() => result.current.startBake(startInput()))
    act(() => result.current.toggleEventCompletion(0))

    expect(result.current.progress.map((p) => p.status)).toEqual([
      'done',
      'current',
      'upcoming',
    ])

    act(() => result.current.toggleEventCompletion(0))

    expect(result.current.progress.map((p) => p.status)).toEqual([
      'current',
      'upcoming',
      'upcoming',
    ])
  })

  it('exposes focusSteps using a 10-minute cluster threshold', () => {
    const schedule = [
      { name: 'Mix', timeMs: NOW.getTime() },
      { name: 'Fold 1', timeMs: NOW.getTime() + 5 * 60_000 },
      { name: 'Shape', timeMs: NOW.getTime() + 6 * 3600_000 },
    ]
    const { result } = renderHook(() => useActiveBatch({ now: NOW }), {
      wrapper: withTestProviders(),
    })

    act(() =>
      result.current.startBake({
        ...startInput(),
        schedule,
      }),
    )

    expect(result.current.focusSteps.map((s) => s.event.name)).toEqual([
      'Mix',
      'Fold 1',
    ])
  })
})
