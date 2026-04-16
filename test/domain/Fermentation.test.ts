import { describe, it, expect, test } from 'vitest'
import {
  Fermentation,
  RatkowskyFermentation,
  RetardFermentation,
  FRIDGE_TEMP,
  COLD_THRESHOLD,
} from '../../src/domain/Fermentation'

describe('Fermentation factory picks strategy by temperature', () => {
  it('creates RatkowskyFermentation for warm temperatures', () => {
    const strategy = Fermentation.create(24, 24, 0.75, 6)
    expect(strategy).toBeInstanceOf(RatkowskyFermentation)
    expect(strategy.method).toBe('same-day')
  })

  it('creates RetardFermentation for cold temperatures', () => {
    const strategy = Fermentation.create(FRIDGE_TEMP, 24, 0.75, 24)
    expect(strategy).toBeInstanceOf(RetardFermentation)
    expect(strategy.method).toBe('cold-retard')
  })

  it('uses cold threshold to dispatch', () => {
    const warm = Fermentation.create(COLD_THRESHOLD, 24, 0.75, 6)
    const cold = Fermentation.create(COLD_THRESHOLD - 1, 24, 0.75, 6)
    expect(warm).toBeInstanceOf(RatkowskyFermentation)
    expect(cold).toBeInstanceOf(RetardFermentation)
  })
})

describe('RatkowskyFermentation starter % matches empirical table', () => {
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
      const strategy = new RatkowskyFermentation(hours, temp, 0.75)
      expect(strategy.method).toBe('same-day')
      const error = Math.abs(strategy.starterPercent - expected) / expected
      expect(error).toBeLessThanOrEqual(0.15)
    },
  )
})

describe('RetardFermentation starter % matches empirical table', () => {
  test.each([
    { coldHours: 10, expected: 0.085 },
    { coldHours: 18, expected: 0.065 },
    { coldHours: 36, expected: 0.04 },
  ])(
    '$coldHours hours cold retard recommends within 20% of $expected',
    ({ coldHours, expected }) => {
      const bulkAt24 = 3
      const strategy = new RetardFermentation(bulkAt24 + coldHours, 24, 0.75)
      expect(strategy.method).toBe('cold-retard')
      const error = Math.abs(strategy.starterPercent - expected) / expected
      expect(error).toBeLessThanOrEqual(0.20)
    },
  )
})

describe('FermentationStrategy zone assessment', () => {
  it.each([6, 10, 14, 20, 24])(
    'returns green for %ih at 24°C',
    (hours) => {
      const strategy = new RatkowskyFermentation(hours, 24, 0.75)
      expect(strategy.zone).toBe('green')
      expect(strategy.warning).toBeNull()
    },
  )

  it.each([4, 5, 30, 36])(
    'returns yellow for %ih at 24°C',
    (hours) => {
      const strategy = new RatkowskyFermentation(hours, 24, 0.75)
      expect(strategy.zone).toBe('yellow')
      expect(strategy.warning).toBeNull()
    },
  )

  it.each([
    { hours: 2, warning: 'Not feasible for sourdough' },
    { hours: 3, warning: 'Not feasible for sourdough' },
  ])(
    'returns red with "$warning" for $hours h (too short)',
    ({ hours, warning }) => {
      const strategy = new RatkowskyFermentation(hours, 24, 0.75)
      expect(strategy.zone).toBe('red')
      expect(strategy.warning).toBe(warning)
    },
  )

  it.each([
    { hours: 40, warning: 'Over-fermentation risk' },
    { hours: 48, warning: 'Over-fermentation risk' },
  ])(
    'returns red with "$warning" for $hours h (too long)',
    ({ hours, warning }) => {
      const strategy = new RatkowskyFermentation(hours, 24, 0.75)
      expect(strategy.zone).toBe('red')
      expect(strategy.warning).toBe(warning)
    },
  )

  it.each([
    { temp: 27, hours: 4, zone: 'green' },
    { temp: 27, hours: 3, zone: 'yellow' },
    { temp: 21, hours: 6, zone: 'yellow' },
    { temp: 21, hours: 8, zone: 'green' },
  ])(
    'zone boundaries scale with temperature: at $temp°C, $hours h is $zone',
    ({ temp, hours, zone }) => {
      expect(new RatkowskyFermentation(hours, temp, 0.75).zone).toBe(zone)
    },
  )
})

describe('FermentationStrategy schedule delegation', () => {
  it('RatkowskyFermentation produces same-day schedule', () => {
    const strategy = new RatkowskyFermentation(6, 24, 0.75)
    const events = strategy.schedule(new Date('2026-04-16T18:00:00'))
    const names = events.map(e => e.name)
    expect(names).toContain('Feed your starter')
    expect(names).not.toContain('Refrigerate')
  })

  it('RetardFermentation produces cold retard schedule', () => {
    const strategy = new RetardFermentation(24, 24, 0.75)
    const events = strategy.schedule(new Date('2026-04-17T09:00:00'))
    const names = events.map(e => e.name)
    expect(names).toContain('Refrigerate')
    expect(names).toContain('Remove from fridge')
  })
})
