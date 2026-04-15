import { describe, it, expect } from 'vitest'
import { determineFermentationZone } from './FermentationZone'

describe('determineFermentationZone at reference conditions (24°C, 75%)', () => {
  it('returns green for 14h (default duration)', () => {
    expect(determineFermentationZone(14, 24, 0.75)).toEqual({
      zone: 'green',
      warning: null,
    })
  })
})
