import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFermentationZone } from '../../../src/application/use-cases/useFermentationZone'

describe('useFermentationZone', () => {
  it('defaults to 14h duration with green zone at 24°C/75%', () => {
    const { result } = renderHook(() => useFermentationZone(24, 0.75))

    expect(result.current.duration).toBe(14)
    expect(result.current.zone).toBe('green')
    expect(result.current.warning).toBeNull()
  })

  it('updates zone when duration changes', () => {
    const { result } = renderHook(() => useFermentationZone(24, 0.75))

    act(() => result.current.changeFermentationDuration(2))

    expect(result.current.duration).toBe(2)
    expect(result.current.zone).toBe('red')
  })

  it('recalculates zone when temperature changes', () => {
    const { result, rerender } = renderHook(
      ({ temp }) => useFermentationZone(temp, 0.75),
      { initialProps: { temp: 24 } },
    )

    act(() => result.current.changeFermentationDuration(5))
    expect(result.current.zone).toBe('yellow')

    rerender({ temp: 27 })
    expect(result.current.zone).toBe('green')
  })

  it('clamps duration to valid range', () => {
    const { result } = renderHook(() => useFermentationZone(24, 0.75))

    act(() => result.current.changeFermentationDuration(0))

    expect(result.current.duration).toBe(1)
    expect(result.current.clampNote.clamped).toBe(true)
  })

  it('exposes zone boundaries in hours for current temperature and hydration', () => {
    const { result } = renderHook(() => useFermentationZone(24, 0.75))

    expect(result.current.boundaries).toEqual({
      greenLow: 6,
      greenHigh: 24,
      yellowLow: 4,
      yellowHigh: 36,
    })
  })

  it('recomputes boundaries when temperature changes', () => {
    const { result, rerender } = renderHook(
      ({ temp }) => useFermentationZone(temp, 0.75),
      { initialProps: { temp: 24 } },
    )

    const at24 = result.current.boundaries
    rerender({ temp: 30 })
    expect(result.current.boundaries).not.toEqual(at24)
  })

  describe('yeast auto cold-retard above 8h duration', () => {
    const yeastCtx = { leavingType: 'yeast' as const, yeastType: 'instant' as const, salt: 0.018 }

    it('selects same-day yeast strategy below the 8h threshold', () => {
      const { result } = renderHook(() => useFermentationZone(22, 0.75, yeastCtx))
      act(() => result.current.changeFermentationDuration(4))
      expect(result.current.strategy.method).toBe('yeast')
    })

    it('selects yeast-retard strategy above the 8h threshold', () => {
      const { result } = renderHook(() => useFermentationZone(22, 0.75, yeastCtx))
      act(() => result.current.changeFermentationDuration(14))
      expect(result.current.strategy.method).toBe('yeast-retard')
    })

    it('widens the green zone when retard auto-selects', () => {
      const { result } = renderHook(() => useFermentationZone(22, 0.75, yeastCtx))
      act(() => result.current.changeFermentationDuration(4))
      const greenHighSameDay = result.current.boundaries.greenHigh
      act(() => result.current.changeFermentationDuration(14))
      const greenHighRetard = result.current.boundaries.greenHigh
      expect(greenHighRetard).toBeGreaterThan(greenHighSameDay)
    })

    it('14h retard at 22°C reads as green or yellow, not red', () => {
      const { result } = renderHook(() => useFermentationZone(22, 0.75, yeastCtx))
      act(() => result.current.changeFermentationDuration(14))
      expect(result.current.zone).not.toBe('red')
    })
  })
})
