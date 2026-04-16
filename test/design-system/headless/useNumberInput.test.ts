import { describe, it, expect, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useNumberInput } from '../../../src/design-system/headless/useNumberInput'

function fakeEvent(value: string) {
  return { target: { value } } as React.ChangeEvent<HTMLInputElement>
}

describe('useNumberInput', () => {
  it('exposes the initial value as text on the input props', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useNumberInput({ value: 800, onChange }))

    expect(result.current.getInputProps()).toEqual({
      type: 'number',
      value: '800',
      onChange: expect.any(Function),
      onBlur: expect.any(Function),
    })
  })

  it('commits numeric input by calling onChange', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useNumberInput({ value: 800, onChange }))

    act(() => result.current.getInputProps().onChange(fakeEvent('900')))

    expect(onChange).toHaveBeenLastCalledWith(900)
    expect(result.current.getInputProps().value).toBe('900')
  })

  it('keeps text without calling onChange when input is empty', () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useNumberInput({ value: 800, onChange }))

    act(() => result.current.getInputProps().onChange(fakeEvent('')))

    expect(onChange).not.toHaveBeenCalled()
    expect(result.current.getInputProps().value).toBe('')
  })

  it('snaps text to the clamped value on blur when upstream diverges', () => {
    // Simulate a clamp: user types 6000, upstream clamps to 5000.
    const onChange = vi.fn()
    const { result, rerender } = renderHook(
      ({ value }) => useNumberInput({ value, onChange }),
      { initialProps: { value: 800 } },
    )

    act(() => result.current.getInputProps().onChange(fakeEvent('6000')))
    expect(onChange).toHaveBeenLastCalledWith(6000)
    expect(result.current.getInputProps().value).toBe('6000')

    // Upstream clamp: value prop becomes 5000 instead of 6000
    rerender({ value: 5000 })
    act(() => result.current.getInputProps().onBlur())

    expect(result.current.getInputProps().value).toBe('5000')
  })

  it('resyncs text when resetKey changes', () => {
    const onChange = vi.fn()
    const { result, rerender } = renderHook(
      ({ value, resetKey }) => useNumberInput({ value, onChange, resetKey }),
      { initialProps: { value: 10, resetKey: 'sourdough' } },
    )

    act(() => result.current.getInputProps().onChange(fakeEvent('25')))
    expect(result.current.getInputProps().value).toBe('25')

    // Switch resetKey + value — text should snap to the new value
    rerender({ value: 1, resetKey: 'yeast' })
    expect(result.current.getInputProps().value).toBe('1')
  })
})
