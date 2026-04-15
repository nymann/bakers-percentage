import { describe, it, expect, test } from 'vitest'
import {
  hasColdPhase,
  recommendStarterPercent,
  type FermentationWindow,
} from './StarterRecommendation'

describe('Scenario 01: same-day adapter selected for no cold phase', () => {
  it('selects same-day when window has no cold phase', () => {
    const window: FermentationWindow = {
      totalHours: 6,
      doughTempC: 24,
      hydration: 0.75,
      starterHydration: 1.0,
    }
    expect(hasColdPhase(window)).toBe(false)
  })

  it('returns a starter percent using same-day path', () => {
    const window: FermentationWindow = {
      totalHours: 6,
      doughTempC: 24,
      hydration: 0.75,
      starterHydration: 1.0,
    }
    const result = recommendStarterPercent(window)
    expect(result.method).toBe('same-day')
    expect(result.starterPercent).toBeGreaterThan(0)
    expect(result.starterPercent).toBeLessThan(1)
  })
})

describe('Scenario 03: same-day starter % matches empirical table', () => {
  test.each([
    { temp: 27, hours: 4, expected: 0.20 },
    { temp: 27, hours: 6, expected: 0.10 },
    { temp: 27, hours: 8, expected: 0.05 },
    { temp: 27, hours: 12, expected: 0.025 },
    { temp: 24, hours: 4, expected: 0.30 },
    { temp: 24, hours: 6, expected: 0.15 },
    { temp: 24, hours: 8, expected: 0.10 },
    { temp: 24, hours: 12, expected: 0.05 },
    { temp: 21, hours: 4, expected: 0.40 },
    { temp: 21, hours: 6, expected: 0.20 },
    { temp: 21, hours: 8, expected: 0.12 },
    { temp: 21, hours: 12, expected: 0.07 },
  ])(
    'at $temp°C for $hours hours recommends within 15% of $expected',
    ({ temp, hours, expected }) => {
      const window: FermentationWindow = {
        totalHours: hours,
        doughTempC: temp,
        hydration: 0.75,
        starterHydration: 1.0,
      }
      const result = recommendStarterPercent(window)
      expect(result.method).toBe('same-day')
      const error = Math.abs(result.starterPercent - expected) / expected
      expect(error).toBeLessThanOrEqual(0.15)
    },
  )
})

describe('Scenario 04: cold retard starter % matches empirical table', () => {
  test.each([
    { coldHours: 10, expected: 0.085 },
    { coldHours: 18, expected: 0.065 },
    { coldHours: 36, expected: 0.04 },
  ])(
    '$coldHours hours cold retard recommends within 20% of $expected',
    ({ coldHours, expected }) => {
      const bulkAt24 = 3
      const window: FermentationWindow = {
        totalHours: bulkAt24 + coldHours,
        doughTempC: 24,
        hydration: 0.75,
        starterHydration: 1.0,
      }
      const result = recommendStarterPercent(window)
      expect(result.method).toBe('cold-retard')
      const error = Math.abs(result.starterPercent - expected) / expected
      expect(error).toBeLessThanOrEqual(0.20)
    },
  )
})

describe('Scenario 02: cold retard adapter selected for overnight', () => {
  it('selects cold retard when window has cold phase', () => {
    const window: FermentationWindow = {
      totalHours: 16,
      doughTempC: 24,
      hydration: 0.75,
      starterHydration: 1.0,
    }
    expect(hasColdPhase(window)).toBe(true)
  })

  it('returns a starter percent using cold-retard path', () => {
    const window: FermentationWindow = {
      totalHours: 16,
      doughTempC: 24,
      hydration: 0.75,
      starterHydration: 1.0,
    }
    const result = recommendStarterPercent(window)
    expect(result.method).toBe('cold-retard')
    expect(result.starterPercent).toBeGreaterThan(0)
    expect(result.starterPercent).toBeLessThan(1)
  })
})
