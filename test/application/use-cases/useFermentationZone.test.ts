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
})
