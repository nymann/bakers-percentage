import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBakingSchedule } from '../../../src/application/use-cases/useBakingSchedule'

describe('useBakingSchedule', () => {
  it('returns cold retard schedule events for sourdough', () => {
    const bakeTime = new Date('2026-04-17T09:00:00')
    const { result } = renderHook(() =>
      useBakingSchedule(bakeTime, 'sourdough', 24, 'cold-retard', 24),
    )

    expect(result.current).toHaveLength(9)
    expect(result.current[0].name).toBe('Feed your starter')
    expect(result.current[result.current.length - 1].name).toBe('Ready to eat')
  })

  it('memoizes result when inputs are stable', () => {
    const bakeTime = new Date('2026-04-17T09:00:00')
    const { result, rerender } = renderHook(() =>
      useBakingSchedule(bakeTime, 'sourdough', 24, 'cold-retard', 24),
    )

    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })
})
