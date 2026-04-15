import { describe, it, expect } from 'vitest'
import { FermentationAssessment } from '../../src/domain/FermentationZone'

describe('FermentationAssessment at reference conditions (24°C, 75%)', () => {
  it.each([6, 10, 14, 20, 24])(
    'returns green for %ih',
    (hours) => {
      const assessment = new FermentationAssessment(hours, 24, 0.75)
      expect(assessment.zone).toBe('green')
      expect(assessment.warning).toBeNull()
    },
  )

  it.each([4, 5, 30, 36])(
    'returns yellow for %ih',
    (hours) => {
      const assessment = new FermentationAssessment(hours, 24, 0.75)
      expect(assessment.zone).toBe('yellow')
      expect(assessment.warning).toBeNull()
    },
  )

  it.each([
    { hours: 2, warning: 'Not feasible for sourdough' },
    { hours: 3, warning: 'Not feasible for sourdough' },
  ])(
    'returns red with "$warning" for $hours h (too short)',
    ({ hours, warning }) => {
      const assessment = new FermentationAssessment(hours, 24, 0.75)
      expect(assessment.zone).toBe('red')
      expect(assessment.warning).toBe(warning)
    },
  )

  it.each([
    { hours: 40, warning: 'Over-fermentation risk' },
    { hours: 48, warning: 'Over-fermentation risk' },
  ])(
    'returns red with "$warning" for $hours h (too long)',
    ({ hours, warning }) => {
      const assessment = new FermentationAssessment(hours, 24, 0.75)
      expect(assessment.zone).toBe('red')
      expect(assessment.warning).toBe(warning)
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
      expect(new FermentationAssessment(hours, temp, 0.75).zone).toBe(zone)
    },
  )
})
