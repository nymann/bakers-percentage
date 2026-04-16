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
    <div className="mb-4">
      <label>
        Finished weight (g) <input {...input.getInputProps()} />
      </label>
      <ClampNote result={clampNote} />
    </div>
  )
}
