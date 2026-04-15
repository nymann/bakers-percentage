import { describe, it, expect } from 'vitest'
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
