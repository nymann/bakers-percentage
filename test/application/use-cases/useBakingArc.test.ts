import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBakingArc } from '../../../src/application/use-cases/useBakingArc'

describe('useBakingArc: placeholder shape', () => {
  it('returns an empty steps array by default', () => {
    const { result } = renderHook(() => useBakingArc())

    expect(result.current.steps).toEqual([])
  })
})
