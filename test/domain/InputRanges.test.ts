import { describe, it, expect } from 'vitest'
import { LOAVES_RANGE } from '../../src/domain/InputRanges'

describe('InputRange.clamp', () => {
  it('returns value unchanged when within range', () => {
    const result = LOAVES_RANGE.clamp(5)
    expect(result).toEqual({ value: 5, clamped: false, range: LOAVES_RANGE })
  })

  it('clamps below minimum to min', () => {
    const result = LOAVES_RANGE.clamp(0)
    expect(result).toEqual({ value: 1, clamped: true, range: LOAVES_RANGE })
  })

  it('clamps above maximum to max', () => {
    const result = LOAVES_RANGE.clamp(25)
    expect(result).toEqual({ value: 20, clamped: true, range: LOAVES_RANGE })
  })

  it('clamps negative values to min', () => {
    const result = LOAVES_RANGE.clamp(-1)
    expect(result).toEqual({ value: 1, clamped: true, range: LOAVES_RANGE })
  })

  it('accepts boundary values without clamping', () => {
    expect(LOAVES_RANGE.clamp(1).clamped).toBe(false)
    expect(LOAVES_RANGE.clamp(20).clamped).toBe(false)
  })
})
