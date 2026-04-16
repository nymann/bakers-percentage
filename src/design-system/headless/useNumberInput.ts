import { useState, type ChangeEvent } from 'react'

type Options = {
  value: number
  onChange: (n: number) => void
  resetKey?: unknown
}

type InputProps = {
  type: 'number'
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onBlur: () => void
}

type NumberInput = {
  getInputProps: () => InputProps
}

export function useNumberInput({ value, onChange, resetKey }: Options): NumberInput {
  const [text, setText] = useState(String(value))
  const [lastCommitted, setLastCommitted] = useState(value)
  const [prevResetKey, setPrevResetKey] = useState(resetKey)
  const [prevValue, setPrevValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey)
    setText(String(value))
    setLastCommitted(value)
    setPrevValue(value)
  } else if (!isFocused && !Object.is(value, prevValue) && !Number.isNaN(value)) {
    // Upstream changed the value while the user isn't editing — mirror it.
    // Object.is keeps NaN === NaN stable; NaN itself we refuse to display.
    setPrevValue(value)
    setText(String(value))
    setLastCommitted(value)
  }

  function handleChange(rawText: string) {
    setText(rawText)
    const n = Number(rawText)
    if (rawText !== '' && !Number.isNaN(n)) {
      setLastCommitted(n)
      onChange(n)
    }
  }

  function handleFocus() {
    setIsFocused(true)
  }

  function handleBlur() {
    setIsFocused(false)
    if (value !== lastCommitted) {
      setText(String(value))
      setLastCommitted(value)
    }
  }

  function getInputProps(): InputProps {
    return {
      type: 'number',
      value: text,
      onChange: (event) => handleChange(event.target.value),
      onFocus: handleFocus,
      onBlur: handleBlur,
    }
  }

  return { getInputProps }
}
