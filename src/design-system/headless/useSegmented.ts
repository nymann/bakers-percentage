import { useId, useRef, type KeyboardEvent } from 'react'

export type SegmentedOption<T extends string> = {
  value: T
  label: string
}

type Options<T extends string> = {
  options: readonly SegmentedOption<T>[]
  value: T | null
  onChange: (value: T) => void
  label: string
}

type RootProps = {
  role: 'radiogroup'
  'aria-label': string
}

type OptionProps = {
  role: 'radio'
  'aria-checked': boolean
  tabIndex: number
  onClick: () => void
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void
  ref: (node: HTMLElement | null) => void
}

export type Segmented<T extends string> = {
  getRootProps: () => RootProps
  getOptionProps: (value: T) => OptionProps
  selectedValue: T | null
}

export function useSegmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: Options<T>): Segmented<T> {
  const refs = useRef<Map<T, HTMLElement>>(new Map())

  function focusAt(index: number) {
    const clamped = (index + options.length) % options.length
    const target = refs.current.get(options[clamped].value)
    target?.focus()
    onChange(options[clamped].value)
  }

  function handleKeyDown(current: T, event: KeyboardEvent<HTMLElement>) {
    const idx = options.findIndex((o) => o.value === current)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      focusAt(idx + 1)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      focusAt(idx - 1)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusAt(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      focusAt(options.length - 1)
    }
  }

  const firstTabbable =
    value ?? options[0]?.value ?? null

  return {
    selectedValue: value,
    getRootProps: () => ({
      role: 'radiogroup',
      'aria-label': label,
    }),
    getOptionProps: (optionValue) => ({
      role: 'radio',
      'aria-checked': value === optionValue,
      tabIndex: optionValue === firstTabbable ? 0 : -1,
      onClick: () => onChange(optionValue),
      onKeyDown: (event) => handleKeyDown(optionValue, event),
      ref: (node) => {
        if (node) refs.current.set(optionValue, node)
        else refs.current.delete(optionValue)
      },
    }),
  }
}

// Re-export useId so consumers can stay decoupled
export { useId }
