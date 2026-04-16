import { useId, type ReactNode } from 'react'
import { useNumberInput } from '../headless/useNumberInput'

export type PercentFieldProps = {
  label: string
  ariaLabel?: string
  helperText?: string
  percent: number
  onChange: (fraction: number) => void
  resetKey?: unknown
  children?: ReactNode
}

export function PercentField({
  label,
  ariaLabel,
  helperText,
  percent,
  onChange,
  resetKey,
  children,
}: PercentFieldProps) {
  const helperId = useId()
  const input = useNumberInput({
    value: Math.round(percent * 100),
    onChange: (n) => onChange(n / 100),
    resetKey,
  })

  const inputProps = input.getInputProps()
  const labelledInputProps = {
    ...inputProps,
    ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
    ...(helperText ? { 'aria-describedby': helperId } : {}),
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-baseline justify-between gap-4">
        <span className="font-body text-sm text-on-surface">
          {label} <span className="sr-only">(%)</span>
        </span>
        <span className="inline-flex items-baseline gap-1 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/20 focus-within:border-primary focus-within:bg-surface-container transition-colors">
          <input
            {...labelledInputProps}
            className="w-12 bg-transparent text-right font-headline italic text-base text-on-surface tabular-nums focus:outline-none"
          />
          <span aria-hidden="true" className="font-label text-xs text-on-surface-variant">
            %
          </span>
        </span>
      </label>
      {helperText && (
        <p
          id={helperId}
          className="font-body text-xs text-on-surface-variant leading-relaxed"
        >
          {helperText}
        </p>
      )}
      {children}
    </div>
  )
}
