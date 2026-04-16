import { describe, it, expect } from 'vitest'
import {
  snapTo15Min,
  nextNineAM,
  minutesBetween,
  hoursBetween,
  addMinutes,
  SNAP_MINUTES,
  TIMELINE_SPAN_HOURS,
  RED_ZONE_MIN_HOURS,
} from '../../src/domain/Timeline'

describe('snapTo15Min', () => {
  it('snaps 09:07 down to 09:00', () => {
    const result = snapTo15Min(new Date(2026, 3, 15, 9, 7))
    expect(result.getHours()).toBe(9)
    expect(result.getMinutes()).toBe(0)
  })

  it('snaps 09:08 up to 09:15', () => {
    const result = snapTo15Min(new Date(2026, 3, 15, 9, 8))
    expect(result.getHours()).toBe(9)
    expect(result.getMinutes()).toBe(15)
  })

  it('leaves 09:00 unchanged', () => {
    const result = snapTo15Min(new Date(2026, 3, 15, 9, 0))
    expect(result.getMinutes()).toBe(0)
  })

  it('leaves 09:15 unchanged', () => {
    const result = snapTo15Min(new Date(2026, 3, 15, 9, 15))
    expect(result.getMinutes()).toBe(15)
  })
})

describe('nextNineAM', () => {
  it('returns tomorrow 09:00 when now is after 09:00', () => {
    const now = new Date(2026, 3, 15, 14, 0)
    const result = nextNineAM(now)
    expect(result.getDate()).toBe(16)
    expect(result.getHours()).toBe(9)
    expect(result.getMinutes()).toBe(0)
  })

  it('returns today 09:00 when now is before 09:00', () => {
    const now = new Date(2026, 3, 15, 7, 30)
    const result = nextNineAM(now)
    expect(result.getDate()).toBe(15)
    expect(result.getHours()).toBe(9)
    expect(result.getMinutes()).toBe(0)
  })

  it('returns tomorrow 09:00 when now is exactly 09:00', () => {
    const now = new Date(2026, 3, 15, 9, 0)
    const result = nextNineAM(now)
    expect(result.getDate()).toBe(16)
    expect(result.getHours()).toBe(9)
  })
})

describe('minutesBetween', () => {
  it('computes positive delta in minutes', () => {
    const a = new Date(2026, 3, 15, 9, 0)
    const b = new Date(2026, 3, 15, 10, 15)
    expect(minutesBetween(b, a)).toBe(75)
  })
})

describe('hoursBetween', () => {
  it('computes positive delta in hours', () => {
    const a = new Date(2026, 3, 15, 9, 0)
    const b = new Date(2026, 3, 15, 14, 0)
    expect(hoursBetween(b, a)).toBe(5)
  })
})

describe('addMinutes', () => {
  it('adds minutes to a date', () => {
    const a = new Date(2026, 3, 15, 9, 0)
    const result = addMinutes(a, 30)
    expect(result.getMinutes()).toBe(30)
  })
})

describe('Timeline constants', () => {
  it('SNAP_MINUTES is 15', () => {
    expect(SNAP_MINUTES).toBe(15)
  })

  it('TIMELINE_SPAN_HOURS is 48', () => {
    expect(TIMELINE_SPAN_HOURS).toBe(48)
  })

  it('RED_ZONE_MIN_HOURS is 4', () => {
    expect(RED_ZONE_MIN_HOURS).toBe(4)
  })
})
