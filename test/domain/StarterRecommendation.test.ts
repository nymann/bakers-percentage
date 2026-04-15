import { describe, it, expect, test } from 'vitest'
import { FermentationWindow } from '../../src/domain/StarterRecommendation'

describe('Scenario 01: same-day adapter selected for no cold phase', () => {
  const window = new FermentationWindow(6, 24, 0.75, 1.0)

  it('selects same-day when window has no cold phase', () => {
    expect(window.hasColdPhase).toBe(false)
  })

  it('returns a starter percent using same-day path', () => {
    const result = window.recommendStarterPercent()
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
      const window = new FermentationWindow(hours, temp, 0.75, 1.0)
      const result = window.recommendStarterPercent()
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
      const window = new FermentationWindow(bulkAt24 + coldHours, 24, 0.75, 1.0)
      const result = window.recommendStarterPercent()
      expect(result.method).toBe('cold-retard')
      const error = Math.abs(result.starterPercent - expected) / expected
      expect(error).toBeLessThanOrEqual(0.20)
    },
  )
})

describe('Scenario 02: cold retard adapter selected for overnight', () => {
  const window = new FermentationWindow(16, 24, 0.75, 1.0)

  it('selects cold retard when window has cold phase', () => {
    expect(window.hasColdPhase).toBe(true)
  })

  it('returns a starter percent using cold-retard path', () => {
    const result = window.recommendStarterPercent()
    expect(result.method).toBe('cold-retard')
    expect(result.starterPercent).toBeGreaterThan(0)
    expect(result.starterPercent).toBeLessThan(1)
  })
})
