import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimeline } from '../../../src/application/use-cases/useTimeline'

function frozen(y: number, m: number, d: number, h: number, min: number) {
  return () => new Date(y, m, d, h, min)
}

describe('useTimeline defaults', () => {
  it('sets bake time to tomorrow 09:00 when mounted after 09:00', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    expect(result.current.bakeTime.getDate()).toBe(16)
    expect(result.current.bakeTime.getHours()).toBe(9)
    expect(result.current.bakeTime.getMinutes()).toBe(0)
  })

  it('sets mix time to 14h before bake time (default duration)', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    // bake = tomorrow 09:00; mix = today 19:00 (14h before)
    expect(result.current.mixTime.getDate()).toBe(15)
    expect(result.current.mixTime.getHours()).toBe(19)
  })

  it('derives duration from bake - mix in hours', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    expect(result.current.duration).toBe(14)
  })

  it('reports mix not in red zone at default', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    expect(result.current.isMixInRedZone).toBe(false)
  })
})

describe('useTimeline changeBakeTime', () => {
  it('snaps bake time to 15-minute increments (down)', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    act(() => {
      result.current.changeBakeTime(new Date(2026, 3, 16, 9, 7))
    })

    expect(result.current.bakeTime.getHours()).toBe(9)
    expect(result.current.bakeTime.getMinutes()).toBe(0)
  })

  it('snaps bake time to 15-minute increments (up)', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    act(() => {
      result.current.changeBakeTime(new Date(2026, 3, 16, 9, 8))
    })

    expect(result.current.bakeTime.getMinutes()).toBe(15)
  })

  it('leaves mix time unchanged when bake time changes', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))
    const originalMix = result.current.mixTime.getTime()

    act(() => {
      result.current.changeBakeTime(new Date(2026, 3, 16, 12, 0))
    })

    expect(result.current.mixTime.getTime()).toBe(originalMix)
  })
})

describe('useTimeline changeMixTime', () => {
  it('snaps mix time to 15-minute increments', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    act(() => {
      result.current.changeMixTime(new Date(2026, 3, 15, 19, 8))
    })

    expect(result.current.mixTime.getMinutes()).toBe(15)
  })

  it('reports mix in red zone when within 4 hours of bake', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    // bake is tomorrow 09:00 — move mix to tomorrow 06:00 (3h gap)
    act(() => {
      result.current.changeMixTime(new Date(2026, 3, 16, 6, 0))
    })

    expect(result.current.isMixInRedZone).toBe(true)
  })

  it('reports mix not in red zone when exactly 4 hours before bake', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    // bake is tomorrow 09:00 — move mix to tomorrow 05:00 (4h gap)
    act(() => {
      result.current.changeMixTime(new Date(2026, 3, 16, 5, 0))
    })

    expect(result.current.isMixInRedZone).toBe(false)
  })
})

describe('useTimeline handle props', () => {
  it('bake handle props include minutes-from-now as value and 48*60 as max', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    const props = result.current.getBakeHandleProps()
    // bake at tomorrow 09:00 = 19h after now = 1140 minutes
    expect(props.value).toBe(19 * 60)
    expect(props.max).toBe(48 * 60)
    expect(props.min).toBe(0)
    expect(props.step).toBe(15)
  })

  it('mix handle props include minutes-from-now as value', () => {
    const now = frozen(2026, 3, 15, 14, 0)
    const { result } = renderHook(() => useTimeline(now))

    const props = result.current.getMixHandleProps()
    // mix at today 19:00 = 5h after now = 300 minutes
    expect(props.value).toBe(5 * 60)
  })
})
