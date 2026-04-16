import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { ClampNote } from '../ClampNote'

export function FinishedWeightField({
  weight,
  onChange,
  clampNote,
  resetKey,
}: {
  weight: number
  onChange: (grams: number) => void
  clampNote: ClampResult
  resetKey?: unknown
}) {
  const input = useNumberInput({ value: weight, onChange, resetKey })

  return (
    <div className="inline-flex items-baseline gap-1">
      <label className="inline-flex items-baseline gap-1 font-label text-[0.7rem] uppercase tracking-widest text-on-surface-variant">
        <span className="sr-only">Finished weight (g)</span>
        <input
          {...input.getInputProps()}
          className="w-20 px-2 py-1 text-sm font-body text-on-surface bg-surface-container-low rounded border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <span aria-hidden="true" className="ml-0.5">g</span>
      </label>
      <ClampNote result={clampNote} />
    </div>
  )
}
