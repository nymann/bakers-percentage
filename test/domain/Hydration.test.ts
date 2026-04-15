import { describe, it, expect } from 'vitest'
import {
  hydrationPercentage,
  HYDRATION_PRESETS,
  type HydrationSelection,
} from '../../src/domain/Hydration'

describe('hydrationPercentage', () => {
  it('returns 68% for Classic preset', () => {
    const selection: HydrationSelection = { mode: 'preset', preset: 'Classic' }
    expect(hydrationPercentage(selection)).toBe(0.68)
  })

  it('returns 75% for Open crumb preset', () => {
    const selection: HydrationSelection = {
      mode: 'preset',
      preset: 'Open crumb',
    }
    expect(hydrationPercentage(selection)).toBe(0.75)
  })

  it('returns 82% for High hydration preset', () => {
    const selection: HydrationSelection = {
      mode: 'preset',
      preset: 'High hydration',
    }
    expect(hydrationPercentage(selection)).toBe(0.82)
  })

  it('returns the given percentage for custom selection', () => {
    const selection: HydrationSelection = {
      mode: 'custom',
      percentage: 0.7,
    }
    expect(hydrationPercentage(selection)).toBe(0.7)
  })
})

describe('HYDRATION_PRESETS', () => {
  it('has exactly 3 presets', () => {
    expect(HYDRATION_PRESETS).toHaveLength(3)
  })
})
