import { describe, it, expect } from 'vitest'
import { generateSchedule, type ScheduleConfig } from './BakingSchedule'

describe('generateSchedule: same-day at 24C', () => {
  const bakeTime = new Date('2026-04-16T18:00:00')
  const config: ScheduleConfig = {
    bakeTime,
    leavingType: 'sourdough',
    doughTempC: 24,
    fermentationMethod: 'same-day',
    totalHours: 6,
  }

  const events = generateSchedule(config)

  it('returns 7 events (no cold retard steps)', () => {
    expect(events).toHaveLength(7)
  })

  it('omits cold retard events', () => {
    const names = events.map(e => e.name)
    expect(names).not.toContain('Shape & refrigerate')
    expect(names).not.toContain('Cold retard begins')
    expect(names).not.toContain('Remove from fridge')
  })

  it('places "Feed your starter" at mix minus 10h', () => {
    // mix = bake - 3h = 15:00; feed = 15:00 - 10h = 05:00
    const feed = events.find(e => e.name === 'Feed your starter')!
    expect(feed.time).toEqual(new Date('2026-04-16T05:00:00'))
  })

  it('places "Mix & bulk fermentation" at bake minus bulk hours', () => {
    // bake - 3h = 15:00
    const mix = events.find(e => e.name === 'Mix & bulk fermentation')!
    expect(mix.time).toEqual(new Date('2026-04-16T15:00:00'))
  })

  it('places "Shape" at mix plus bulk hours', () => {
    // mix + 3h = 18:00
    const shape = events.find(e => e.name === 'Shape')!
    expect(shape.time).toEqual(new Date('2026-04-16T18:00:00'))
  })

  it('places "Preheat oven" at bake minus 45m', () => {
    const preheat = events.find(e => e.name === 'Preheat oven')!
    expect(preheat.time).toEqual(new Date('2026-04-16T17:15:00'))
  })

  it('places "Bake" at bake time', () => {
    const bake = events.find(e => e.name === 'Bake')!
    expect(bake.time).toEqual(bakeTime)
  })

  it('places "Out of oven" at bake plus 45m', () => {
    const outOfOven = events.find(e => e.name === 'Out of oven')!
    expect(outOfOven.time).toEqual(new Date('2026-04-16T18:45:00'))
  })

  it('places "Ready to eat" at bake plus 1h15m', () => {
    const ready = events.find(e => e.name === 'Ready to eat')!
    expect(ready.time).toEqual(new Date('2026-04-16T19:15:00'))
  })
})

describe('generateSchedule: yeast', () => {
  const bakeTime = new Date('2026-04-16T18:00:00')
  const config: ScheduleConfig = {
    bakeTime,
    leavingType: 'yeast',
    doughTempC: 24,
    fermentationMethod: 'same-day',
    totalHours: 0,
  }

  const events = generateSchedule(config)

  it('returns 8 events', () => {
    expect(events).toHaveLength(8)
  })

  it('has no starter feed event', () => {
    const names = events.map(e => e.name)
    expect(names).not.toContain('Feed your starter')
  })

  it('has no cold retard events', () => {
    const names = events.map(e => e.name)
    expect(names).not.toContain('Shape & refrigerate')
    expect(names).not.toContain('Cold retard begins')
    expect(names).not.toContain('Remove from fridge')
  })

  it('places "Mix dough" at bake minus 4h45m', () => {
    // 18:00 - 4h45m = 13:15
    const mix = events.find(e => e.name === 'Mix dough')!
    expect(mix.time).toEqual(new Date('2026-04-16T13:15:00'))
  })

  it('places "First rise" at mix time', () => {
    const firstRise = events.find(e => e.name === 'First rise')!
    expect(firstRise.time).toEqual(new Date('2026-04-16T13:15:00'))
  })

  it('places "Shape" at mix plus 1h30m', () => {
    // 13:15 + 1h30m = 14:45
    const shape = events.find(e => e.name === 'Shape')!
    expect(shape.time).toEqual(new Date('2026-04-16T14:45:00'))
  })

  it('places "Second rise" at shape time', () => {
    const secondRise = events.find(e => e.name === 'Second rise')!
    expect(secondRise.time).toEqual(new Date('2026-04-16T14:45:00'))
  })

  it('places "Preheat oven" at bake minus 45m', () => {
    const preheat = events.find(e => e.name === 'Preheat oven')!
    expect(preheat.time).toEqual(new Date('2026-04-16T17:15:00'))
  })

  it('places "Bake" at bake time', () => {
    const bake = events.find(e => e.name === 'Bake')!
    expect(bake.time).toEqual(bakeTime)
  })

  it('places "Out of oven" at bake plus 45m', () => {
    const outOfOven = events.find(e => e.name === 'Out of oven')!
    expect(outOfOven.time).toEqual(new Date('2026-04-16T18:45:00'))
  })

  it('places "Ready to eat" at bake plus 1h15m', () => {
    const ready = events.find(e => e.name === 'Ready to eat')!
    expect(ready.time).toEqual(new Date('2026-04-16T19:15:00'))
  })
})

describe('generateSchedule: starter feed tracks mix time', () => {
  const bakeTime = new Date('2026-04-17T09:00:00')

  it.each([
    { tempC: 21, label: '21C (bulk 4h)' },
    { tempC: 24, label: '24C (bulk 3h)' },
    { tempC: 27, label: '27C (bulk 2h)' },
  ])('at $label, feed is always 10h before mix', ({ tempC }) => {
    const events = generateSchedule({
      bakeTime,
      leavingType: 'sourdough',
      doughTempC: tempC,
      fermentationMethod: 'cold-retard',
      totalHours: 24,
    })

    const mix = events.find(e => e.name === 'Mix & bulk fermentation')!
    const feed = events.find(e => e.name === 'Feed your starter')!
    const diffHours = (mix.time.getTime() - feed.time.getTime()) / (1000 * 60 * 60)
    expect(diffHours).toBe(10)
  })

  it.each([
    { tempC: 21, label: '21C' },
    { tempC: 24, label: '24C' },
    { tempC: 27, label: '27C' },
  ])('same-day at $label also has feed 10h before mix', ({ tempC }) => {
    const events = generateSchedule({
      bakeTime,
      leavingType: 'sourdough',
      doughTempC: tempC,
      fermentationMethod: 'same-day',
      totalHours: 6,
    })

    const mix = events.find(e => e.name === 'Mix & bulk fermentation')!
    const feed = events.find(e => e.name === 'Feed your starter')!
    const diffHours = (mix.time.getTime() - feed.time.getTime()) / (1000 * 60 * 60)
    expect(diffHours).toBe(10)
  })
})

describe('generateSchedule: cold retard at 24C', () => {
  const bakeTime = new Date('2026-04-17T09:00:00')
  const config: ScheduleConfig = {
    bakeTime,
    leavingType: 'sourdough',
    doughTempC: 24,
    fermentationMethod: 'cold-retard',
    totalHours: 24,
  }

  const events = generateSchedule(config)

  it('returns 9 events', () => {
    expect(events).toHaveLength(9)
  })

  it('returns events in chronological order', () => {
    for (let i = 1; i < events.length; i++) {
      expect(events[i].time.getTime()).toBeGreaterThanOrEqual(events[i - 1].time.getTime())
    }
  })

  it('places "Feed your starter" at mix minus 10h', () => {
    // mix = bake - 24h = Apr 16 09:00; feed = mix - 10h = Apr 15 23:00
    const feed = events.find(e => e.name === 'Feed your starter')!
    expect(feed.time).toEqual(new Date('2026-04-15T23:00:00'))
  })

  it('places "Mix & bulk fermentation" at bake minus totalHours', () => {
    // bake - 24h = Apr 16 09:00
    const mix = events.find(e => e.name === 'Mix & bulk fermentation')!
    expect(mix.time).toEqual(new Date('2026-04-16T09:00:00'))
  })

  it('places "Shape & refrigerate" at mix plus bulk hours', () => {
    // mix + 3h = Apr 16 12:00
    const shape = events.find(e => e.name === 'Shape & refrigerate')!
    expect(shape.time).toEqual(new Date('2026-04-16T12:00:00'))
  })

  it('places "Cold retard begins" at shape time', () => {
    const coldRetard = events.find(e => e.name === 'Cold retard begins')!
    expect(coldRetard.time).toEqual(new Date('2026-04-16T12:00:00'))
  })

  it('places "Remove from fridge" at bake minus 1h15m', () => {
    const remove = events.find(e => e.name === 'Remove from fridge')!
    expect(remove.time).toEqual(new Date('2026-04-17T07:45:00'))
  })

  it('places "Preheat oven" at bake minus 45m', () => {
    const preheat = events.find(e => e.name === 'Preheat oven')!
    expect(preheat.time).toEqual(new Date('2026-04-17T08:15:00'))
  })

  it('places "Bake" at bake time', () => {
    const bake = events.find(e => e.name === 'Bake')!
    expect(bake.time).toEqual(bakeTime)
  })

  it('places "Out of oven" at bake plus 45m', () => {
    const outOfOven = events.find(e => e.name === 'Out of oven')!
    expect(outOfOven.time).toEqual(new Date('2026-04-17T09:45:00'))
  })

  it('places "Ready to eat" at bake plus 1h15m', () => {
    const ready = events.find(e => e.name === 'Ready to eat')!
    expect(ready.time).toEqual(new Date('2026-04-17T10:15:00'))
  })
})
