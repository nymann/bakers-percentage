import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useStarterRecommendation } from '../../../src/application/use-cases/useStarterRecommendation'

describe('Scenario 05: override starter percent', () => {
  it('auto-recommends starter % for a given window', () => {
    const { result } = renderHook(() =>
      useStarterRecommendation({ totalHours: 6, doughTempC: 24, hydration: 0.75, starterHydration: 1.0 }),
    )

    expect(result.current.recommendedPercent).toBeGreaterThan(0)
    expect(result.current.effectivePercent).toBe(result.current.recommendedPercent)
    expect(result.current.isOverridden).toBe(false)
  })

  it('uses manual override when user changes starter %', () => {
    const { result } = renderHook(() =>
      useStarterRecommendation({ totalHours: 14, doughTempC: 24, hydration: 0.75, starterHydration: 1.0 }),
    )

    const recommended = result.current.recommendedPercent

    act(() => result.current.overrideStarterPercent(0.15))

    expect(result.current.effectivePercent).toBe(0.15)
    expect(result.current.recommendedPercent).toBe(recommended)
    expect(result.current.isOverridden).toBe(true)
  })

  it('reports auto-selected method', () => {
    const { result } = renderHook(() =>
      useStarterRecommendation({ totalHours: 6, doughTempC: 24, hydration: 0.75, starterHydration: 1.0 }),
    )
    expect(result.current.autoMethod).toBe('same-day')
    expect(result.current.effectiveMethod).toBe('same-day')
  })
})

describe('Scenario 06: override method', () => {
  it('auto-selects cold retard for long window', () => {
    const { result } = renderHook(() =>
      useStarterRecommendation({ totalHours: 14, doughTempC: 24, hydration: 0.75, starterHydration: 1.0 }),
    )
    expect(result.current.autoMethod).toBe('cold-retard')
    expect(result.current.effectiveMethod).toBe('cold-retard')
  })

  it('recalculates starter % when method is overridden to same-day', () => {
    const { result } = renderHook(() =>
      useStarterRecommendation({ totalHours: 14, doughTempC: 24, hydration: 0.75, starterHydration: 1.0 }),
    )

    const coldRetardPercent = result.current.recommendedPercent

    act(() => result.current.overrideMethod('same-day'))

    expect(result.current.effectiveMethod).toBe('same-day')
    expect(result.current.isMethodOverridden).toBe(true)
    expect(result.current.recommendedPercent).not.toBe(coldRetardPercent)
  })
})

describe('Scenario 08: reset to recommended', () => {
  it('clears starter % override', () => {
    const { result } = renderHook(() =>
      useStarterRecommendation({ totalHours: 14, doughTempC: 24, hydration: 0.75, starterHydration: 1.0 }),
    )

    act(() => result.current.overrideStarterPercent(0.25))
    expect(result.current.isOverridden).toBe(true)

    act(() => result.current.useRecommended())

    expect(result.current.isOverridden).toBe(false)
    expect(result.current.effectivePercent).toBe(result.current.recommendedPercent)
  })

  it('clears method override', () => {
    const { result } = renderHook(() =>
      useStarterRecommendation({ totalHours: 14, doughTempC: 24, hydration: 0.75, starterHydration: 1.0 }),
    )

    act(() => result.current.overrideMethod('same-day'))
    expect(result.current.isMethodOverridden).toBe(true)

    act(() => result.current.useRecommended())

    expect(result.current.isMethodOverridden).toBe(false)
    expect(result.current.effectiveMethod).toBe('cold-retard')
  })

  it('clears both overrides at once', () => {
    const { result } = renderHook(() =>
      useStarterRecommendation({ totalHours: 14, doughTempC: 24, hydration: 0.75, starterHydration: 1.0 }),
    )

    act(() => {
      result.current.overrideStarterPercent(0.25)
      result.current.overrideMethod('same-day')
    })

    act(() => result.current.useRecommended())

    expect(result.current.isOverridden).toBe(false)
    expect(result.current.isMethodOverridden).toBe(false)
  })

  it('hasAnyOverride is false when no overrides active', () => {
    const { result } = renderHook(() =>
      useStarterRecommendation({ totalHours: 6, doughTempC: 24, hydration: 0.75, starterHydration: 1.0 }),
    )
    expect(result.current.hasAnyOverride).toBe(false)
  })

  it('hasAnyOverride is true when either override active', () => {
    const { result } = renderHook(() =>
      useStarterRecommendation({ totalHours: 14, doughTempC: 24, hydration: 0.75, starterHydration: 1.0 }),
    )

    act(() => result.current.overrideStarterPercent(0.25))
    expect(result.current.hasAnyOverride).toBe(true)
  })
})
