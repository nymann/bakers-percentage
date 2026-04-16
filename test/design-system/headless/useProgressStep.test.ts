import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useProgressStep } from '../../../src/design-system/headless/useProgressStep'

describe('useProgressStep: step mapping', () => {
  it('returns each step with its label and status', () => {
    const { result } = renderHook(() =>
      useProgressStep({
        steps: [
          { id: 'autolyse', label: 'Autolyse', status: 'done' },
          { id: 'bulk', label: 'Bulk Ferment', status: 'current' },
          { id: 'bake', label: 'Bake', status: 'upcoming' },
        ],
      }),
    )

    expect(result.current.steps.map((s) => s.label)).toEqual([
      'Autolyse',
      'Bulk Ferment',
      'Bake',
    ])
  })

  it('marks the current step with aria-current="step"', () => {
    const { result } = renderHook(() =>
      useProgressStep({
        steps: [
          { id: 'autolyse', label: 'Autolyse', status: 'done' },
          { id: 'bulk', label: 'Bulk Ferment', status: 'current' },
          { id: 'bake', label: 'Bake', status: 'upcoming' },
        ],
      }),
    )

    const props = result.current.steps.map((s) => s.getItemProps()['aria-current'])
    expect(props).toEqual([undefined, 'step', undefined])
  })
})
