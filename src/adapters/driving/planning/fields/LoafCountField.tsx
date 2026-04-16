import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { ClampNote } from '../ClampNote'

export function LoafCountField({
  loaves,
  onChange,
  clampNote,
}: {
  loaves: number
  onChange: (count: number) => void
  clampNote: ClampResult
}) {
  const input = useNumberInput({ value: loaves, onChange })

  const decrement = () => onChange(Math.max(1, loaves - 1))
  const increment = () => onChange(loaves + 1)

  return (
    <div className="inline-flex items-center gap-2">
      <div className="inline-flex items-center gap-1 bg-surface-container-low rounded-full px-1 py-0.5 border border-outline-variant/30">
        <button
          type="button"
          aria-label="Decrease loaf count"
          onClick={decrement}
          className="w-6 h-6 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-sm leading-none"
        >
          −
        </button>
        <label className="inline-flex items-center">
          <span className="sr-only">Loaf count</span>
          <input
            {...input.getInputProps()}
            className="w-10 bg-transparent text-center text-sm font-body text-on-surface focus:outline-none"
          />
        </label>
        <button
          type="button"
          aria-label="Increase loaf count"
          onClick={increment}
          className="w-6 h-6 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-sm leading-none"
        >
          +
        </button>
      </div>
      <ClampNote result={clampNote} />
    </div>
  )
}
