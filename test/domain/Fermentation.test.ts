import { describe, it, expect, test } from 'vitest'
import {
  Fermentation,
  RatkowskyFermentation,
  RetardFermentation,
  YeastFermentation,
  YeastRetardFermentation,
  createYeastFermentation,
  yeastFermentationBoundaries,
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
      const error = Math.abs(strategy.inoculumPercent - expected) / expected
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
      const error = Math.abs(strategy.inoculumPercent - expected) / expected
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

describe('YeastFermentation Q10 inoculum recommendation', () => {
  it('halving duration roughly doubles recommended yeast %', () => {
    const fourHour = new YeastFermentation(4, 24, 'instant')
    const eightHour = new YeastFermentation(8, 24, 'instant')
    expect(fourHour.inoculumPercent / eightHour.inoculumPercent).toBeCloseTo(2, 1)
  })

  it('matches reference point: 1% IDY at 24°C, 4h, 1.8% salt', () => {
    const reference = new YeastFermentation(4, 24, 'instant', 0.018)
    expect(reference.inoculumPercent).toBeCloseTo(0.01, 3)
  })

  it('cooler dough requires more yeast for the same duration (Q10)', () => {
    const warm = new YeastFermentation(6, 24, 'instant')
    const cool = new YeastFermentation(6, 14, 'instant')
    expect(cool.inoculumPercent).toBeGreaterThan(warm.inoculumPercent)
    // Q10 = 2.2 → 10°C drop ≈ 2.2× more yeast
    expect(cool.inoculumPercent / warm.inoculumPercent).toBeCloseTo(2.2, 1)
  })

  it('fresh yeast is 3× the instant recommendation by mass', () => {
    const instant = new YeastFermentation(6, 24, 'instant')
    const fresh = new YeastFermentation(6, 24, 'fresh')
    expect(fresh.inoculumPercent / instant.inoculumPercent).toBeCloseTo(3, 2)
  })

  it('higher salt scales recommendation upward to compensate for inhibition', () => {
    const lowSalt = new YeastFermentation(6, 24, 'instant', 0.010)
    const highSalt = new YeastFermentation(6, 24, 'instant', 0.025)
    expect(highSalt.inoculumPercent).toBeGreaterThan(lowSalt.inoculumPercent)
  })
})

describe('YeastFermentation zone assessment', () => {
  it.each([2, 4, 6])(
    'returns green for %ih at 24°C',
    (hours) => {
      const strategy = new YeastFermentation(hours, 24, 'instant')
      expect(strategy.zone).toBe('green')
      expect(strategy.warning).toBeNull()
    },
  )

  it('returns red with "Too fast" warning when duration is below the yellow lower bound', () => {
    const strategy = new YeastFermentation(0.1, 24, 'instant')
    expect(strategy.zone).toBe('red')
    expect(strategy.warning).toMatch(/too fast|flat/i)
  })

  it('returns red with "Over-proof" warning when duration exceeds the yellow upper bound', () => {
    const strategy = new YeastFermentation(20, 24, 'instant')
    expect(strategy.zone).toBe('red')
    expect(strategy.warning).toMatch(/over-proof/i)
  })

  it('zone boundaries widen as temperature drops (Q10)', () => {
    const warm = yeastFermentationBoundaries(24)
    const cool = yeastFermentationBoundaries(14)
    expect(cool.greenHigh).toBeGreaterThan(warm.greenHigh)
    expect(cool.greenLow).toBeGreaterThan(warm.greenLow)
  })
})

describe('YeastRetardFermentation handles fridge temperatures', () => {
  it('returns yeast above zero at 4°C — yeast keeps fermenting in the cold', () => {
    const strategy = new YeastRetardFermentation(12, 4, 'instant')
    expect(strategy.inoculumPercent).toBeGreaterThan(0)
  })

  it('produces a cold-retard schedule with refrigeration step', () => {
    const strategy = new YeastRetardFermentation(12, 4, 'instant')
    const events = strategy.schedule(new Date('2026-04-17T09:00:00'))
    const names = events.map(e => e.name)
    expect(names).toContain('Refrigerate')
  })
})

describe('createYeastFermentation factory dispatches by temperature', () => {
  it('picks YeastFermentation for warm temperatures', () => {
    const strategy = createYeastFermentation(6, 24, 'instant', 0.018)
    expect(strategy).toBeInstanceOf(YeastFermentation)
    expect(strategy.method).toBe('yeast')
  })

  it('picks YeastRetardFermentation below the cold threshold', () => {
    const strategy = createYeastFermentation(12, FRIDGE_TEMP, 'instant', 0.018)
    expect(strategy).toBeInstanceOf(YeastRetardFermentation)
    expect(strategy.method).toBe('yeast-retard')
  })
})
