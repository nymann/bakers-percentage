import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBakeTime } from '../../../src/application/use-cases/useBakeTime'

describe('useBakeTime', () => {
  function frozenNow(isoString: string) {
    return () => new Date(isoString)
  }

  it('derives initial bake time from previous duration', () => {
    const now = frozenNow('2026-04-16T20:00:00')
    const { result } = renderHook(() => useBakeTime(14, now))

    // now + 14h = 2026-04-17T10:00
    const bakeTime = result.current.bakeTime
    expect(bakeTime.getDate()).toBe(17)
    expect(bakeTime.getHours()).toBe(10)
    expect(bakeTime.getMinutes()).toBe(0)
    expect(result.current.duration).toBe(14)
  })

  it('updates duration when bake time changes', () => {
    const now = frozenNow('2026-04-16T12:00:00')
    const { result } = renderHook(() => useBakeTime(14, now))

    act(() => {
      result.current.changeBakeTime(new Date('2026-04-16T18:00:00'))
    })

    // 18:00 - 12:00 = 6 hours
    expect(result.current.duration).toBe(6)
  })

  it('clamps duration to fermentation range minimum', () => {
    const now = frozenNow('2026-04-16T12:00:00')
    const { result } = renderHook(() => useBakeTime(14, now))

    act(() => {
      result.current.changeBakeTime(new Date('2026-04-16T12:30:00'))
    })

    // 0.5h would be below min (1h), clamped to 1
    expect(result.current.duration).toBe(1)
  })
})
