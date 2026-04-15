import { describe, it, expect } from 'vitest'
import { clampToRange, LOAVES_RANGE } from './InputRanges'

describe('clampToRange', () => {
  it('returns value unchanged when within range', () => {
    const result = clampToRange(5, LOAVES_RANGE)
    expect(result).toEqual({ value: 5, clamped: false, range: LOAVES_RANGE })
  })

  it('clamps below minimum to min', () => {
    const result = clampToRange(0, LOAVES_RANGE)
    expect(result).toEqual({ value: 1, clamped: true, range: LOAVES_RANGE })
  })

  it('clamps above maximum to max', () => {
    const result = clampToRange(25, LOAVES_RANGE)
    expect(result).toEqual({ value: 20, clamped: true, range: LOAVES_RANGE })
  })

  it('clamps negative values to min', () => {
    const result = clampToRange(-1, LOAVES_RANGE)
    expect(result).toEqual({ value: 1, clamped: true, range: LOAVES_RANGE })
  })

  it('accepts boundary values without clamping', () => {
    expect(clampToRange(1, LOAVES_RANGE).clamped).toBe(false)
    expect(clampToRange(20, LOAVES_RANGE).clamped).toBe(false)
  })
})
