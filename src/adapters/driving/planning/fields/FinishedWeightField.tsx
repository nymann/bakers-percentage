import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { ClampNote } from '../ClampNote'

export function FinishedWeightField({
  weight,
  onChange,
  clampNote,
  validationEnabled,
  resetKey,
}: {
  weight: number
  onChange: (grams: number) => void
  clampNote: ClampResult
  validationEnabled: boolean
  resetKey?: unknown
}) {
  const input = useNumberInput({ value: weight, onChange, resetKey })

  return (
    <div className="mb-4">
      <label>
        Finished weight (g) <input {...input.getInputProps()} />
      </label>
      {validationEnabled && <ClampNote result={clampNote} />}
    </div>
  )
}
