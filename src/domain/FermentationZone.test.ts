import { describe, it, expect } from 'vitest'
import { determineFermentationZone } from './FermentationZone'

describe('determineFermentationZone at reference conditions (24°C, 75%)', () => {
  it.each([6, 10, 14, 20, 24])(
    'returns green for %ih',
    (hours) => {
      expect(determineFermentationZone(hours, 24, 0.75)).toEqual({
        zone: 'green',
        warning: null,
      })
    },
  )

  it.each([4, 5, 30, 36])(
    'returns yellow for %ih',
    (hours) => {
      expect(determineFermentationZone(hours, 24, 0.75)).toEqual({
        zone: 'yellow',
        warning: null,
      })
    },
  )

  it.each([
    { hours: 2, warning: 'Not feasible for sourdough' },
    { hours: 3, warning: 'Not feasible for sourdough' },
  ])(
    'returns red with "$warning" for $hours h (too short)',
    ({ hours, warning }) => {
      expect(determineFermentationZone(hours, 24, 0.75)).toEqual({
        zone: 'red',
        warning,
      })
    },
  )

  it.each([
    { hours: 40, warning: 'Over-fermentation risk' },
    { hours: 48, warning: 'Over-fermentation risk' },
  ])(
    'returns red with "$warning" for $hours h (too long)',
    ({ hours, warning }) => {
      expect(determineFermentationZone(hours, 24, 0.75)).toEqual({
        zone: 'red',
        warning,
      })
    },
  )
})

describe('zone boundaries scale with dough temperature', () => {
  it.each([
    { temp: 27, hours: 4, zone: 'green' },
    { temp: 27, hours: 3, zone: 'yellow' },
    { temp: 21, hours: 6, zone: 'yellow' },
    { temp: 21, hours: 8, zone: 'green' },
  ])(
    'at $temp°C, $hours h is $zone',
    ({ temp, hours, zone }) => {
      expect(determineFermentationZone(hours, temp, 0.75).zone).toBe(zone)
    },
  )
})
