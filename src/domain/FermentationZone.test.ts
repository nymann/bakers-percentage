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
})
