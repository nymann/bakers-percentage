import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useActiveBatch } from '../../../src/application/use-cases/useActiveBatch'

describe('useActiveBatch: placeholder shape', () => {
  it('returns a null batch by default (no active bake)', () => {
    const { result } = renderHook(() => useActiveBatch())

    expect(result.current.batch).toBeNull()
  })
})
