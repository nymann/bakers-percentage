import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBakeTime } from './useBakeTime'

describe('useBakeTime', () => {
  function frozenNow(isoString: string) {
    return () => new Date(isoString)
  }

  it('defaults bake time to tomorrow 09:00 local', () => {
    const now = frozenNow('2026-04-16T20:00:00')
    const { result } = renderHook(() => useBakeTime(now))

    const bakeTime = result.current.bakeTime
    expect(bakeTime.getFullYear()).toBe(2026)
    expect(bakeTime.getMonth()).toBe(3) // April = 3
    expect(bakeTime.getDate()).toBe(17) // tomorrow
    expect(bakeTime.getHours()).toBe(9)
    expect(bakeTime.getMinutes()).toBe(0)
  })

  it('derives duration from now to bake time in hours', () => {
    const now = frozenNow('2026-04-16T20:00:00')
    const { result } = renderHook(() => useBakeTime(now))

    // Tomorrow 09:00 - today 20:00 = 13 hours
    expect(result.current.duration).toBe(13)
  })

  it('updates duration when bake time changes', () => {
    const now = frozenNow('2026-04-16T12:00:00')
    const { result } = renderHook(() => useBakeTime(now))

    act(() => {
      result.current.changeBakeTime(new Date('2026-04-16T18:00:00'))
    })

    // 18:00 - 12:00 = 6 hours
    expect(result.current.duration).toBe(6)
  })

  it('clamps duration to fermentation range minimum', () => {
    const now = frozenNow('2026-04-16T12:00:00')
    const { result } = renderHook(() => useBakeTime(now))

    act(() => {
      result.current.changeBakeTime(new Date('2026-04-16T12:30:00'))
    })

    // 0.5h would be below min (1h), clamped to 1
    expect(result.current.duration).toBe(1)
  })
})
