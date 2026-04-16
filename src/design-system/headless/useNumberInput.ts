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
  onBlur: () => void
}

type NumberInput = {
  getInputProps: () => InputProps
}

export function useNumberInput({ value, onChange, resetKey }: Options): NumberInput {
  const [text, setText] = useState(String(value))
  const [lastCommitted, setLastCommitted] = useState(value)
  const [prevResetKey, setPrevResetKey] = useState(resetKey)

  if (resetKey !== prevResetKey) {
    setPrevResetKey(resetKey)
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

  function handleBlur() {
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
      onBlur: handleBlur,
    }
  }

  return { getInputProps }
}
