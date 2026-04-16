import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCheckboxList } from '../../../src/design-system/headless/useCheckboxList'

describe('useCheckboxList: state initialisation', () => {
  it('starts with all items unchecked', () => {
    const { result } = renderHook(() =>
      useCheckboxList({ items: ['First Fold', 'Second Fold', 'Third Fold'] }),
    )

    expect(result.current.items.map((item) => item.checked)).toEqual([false, false, false])
  })

  it('exposes the label for each item', () => {
    const { result } = renderHook(() =>
      useCheckboxList({ items: ['First Fold', 'Second Fold'] }),
    )

    expect(result.current.items.map((item) => item.label)).toEqual([
      'First Fold',
      'Second Fold',
    ])
  })
})

describe('useCheckboxList: toggle behaviour', () => {
  it('toggle flips the checked flag for the target item', () => {
    const { result } = renderHook(() =>
      useCheckboxList({ items: ['A', 'B'] }),
    )

    act(() => {
      result.current.toggle(0)
    })

    expect(result.current.items[0]!.checked).toBe(true)
    expect(result.current.items[1]!.checked).toBe(false)

    act(() => {
      result.current.toggle(0)
    })

    expect(result.current.items[0]!.checked).toBe(false)
  })

  it('toggles are independent across items', () => {
    const { result } = renderHook(() =>
      useCheckboxList({ items: ['A', 'B', 'C'] }),
    )

    act(() => {
      result.current.toggle(1)
    })

    expect(result.current.items.map((i) => i.checked)).toEqual([false, true, false])
  })
})
