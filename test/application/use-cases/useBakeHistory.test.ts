import { describe, it, expect } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useBakeHistory } from '../../../src/application/use-cases/useBakeHistory'
import { withTestProviders } from '../../wrappers'
import type { FinishedBake } from '../../../src/domain/Bake'

const NOW = Date.parse('2026-04-16T12:00:00.000Z')

const SAMPLE_BAKE: FinishedBake = {
  id: 'bake-1',
  name: 'Sourdough · 1 loaf · 900g',
  startedAtMs: NOW - 8 * 3600_000,
  finishedAtMs: NOW,
  recipe: {
    ingredients: [{ name: 'Flour', grams: 500, percentage: 1 }],
    totalDoughWeight: 900,
    finishedWeightPerLoaf: 900,
    loaves: 1,
    hydration: 0.75,
  },
  schedule: [{ name: 'Bake', timeMs: NOW }],
  checklist: [{ label: 'Shape', checked: true }],
}

describe('useBakeHistory: empty state', () => {
  it('reports isEmpty when there are no past bakes', () => {
    const { result } = renderHook(() => useBakeHistory(), {
      wrapper: withTestProviders(),
    })
    expect(result.current.bakes).toEqual([])
    expect(result.current.isEmpty).toBe(true)
    expect(result.current.selected).toBeNull()
  })
})

describe('useBakeHistory: seeded history', () => {
  it('exposes past bakes from storage', () => {
    const { result } = renderHook(() => useBakeHistory(), {
      wrapper: withTestProviders({ seed: { history: [SAMPLE_BAKE] } }),
    })
    expect(result.current.isEmpty).toBe(false)
    expect(result.current.bakes).toHaveLength(1)
  })

  it('selects a bake by id', () => {
    const { result } = renderHook(() => useBakeHistory(), {
      wrapper: withTestProviders({ seed: { history: [SAMPLE_BAKE] } }),
    })

    act(() => result.current.select('bake-1'))
    expect(result.current.selected?.id).toBe('bake-1')
  })

  it('removes a bake from history', () => {
    const { result } = renderHook(() => useBakeHistory(), {
      wrapper: withTestProviders({ seed: { history: [SAMPLE_BAKE] } }),
    })

    act(() => result.current.remove('bake-1'))
    expect(result.current.isEmpty).toBe(true)
  })

  it('clears selection when the selected bake is removed', () => {
    const { result } = renderHook(() => useBakeHistory(), {
      wrapper: withTestProviders({ seed: { history: [SAMPLE_BAKE] } }),
    })

    act(() => result.current.select('bake-1'))
    act(() => result.current.remove('bake-1'))

    expect(result.current.selected).toBeNull()
  })
})
