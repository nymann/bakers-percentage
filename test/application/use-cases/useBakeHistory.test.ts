import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBakeHistory } from '../../../src/application/use-cases/useBakeHistory'

describe('useBakeHistory: scaffold shape', () => {
  it('returns an empty list of past bakes', () => {
    const { result } = renderHook(() => useBakeHistory())
    expect(result.current.bakes).toEqual([])
  })

  it('reports isEmpty when there are no past bakes', () => {
    const { result } = renderHook(() => useBakeHistory())
    expect(result.current.isEmpty).toBe(true)
  })
})
