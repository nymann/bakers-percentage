import { describe, it, expect } from 'vitest'
import {
  PresetHydration,
  CustomHydration,
  HYDRATION_PRESETS,
} from '../../src/domain/Hydration'

describe('PresetHydration', () => {
  it('returns 68% for Classic preset', () => {
    expect(new PresetHydration('Classic').percentage).toBe(0.68)
  })

  it('returns 75% for Open crumb preset', () => {
    expect(new PresetHydration('Open crumb').percentage).toBe(0.75)
  })

  it('returns 82% for High hydration preset', () => {
    expect(new PresetHydration('High hydration').percentage).toBe(0.82)
  })
})

describe('CustomHydration', () => {
  it('returns the given percentage', () => {
    expect(new CustomHydration(0.7).percentage).toBe(0.7)
  })
})

describe('HYDRATION_PRESETS', () => {
  it('has exactly 3 presets', () => {
    expect(HYDRATION_PRESETS).toHaveLength(3)
  })
})
