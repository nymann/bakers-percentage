import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { tokens } from '../../../../design-system/tokens'
import { ClampNote } from '../ClampNote'

export function FinishedWeightField({
  weight,
  onChange,
  clampNote,
  validationEnabled,
}: {
  weight: number
  onChange: (grams: number) => void
  clampNote: ClampResult
  validationEnabled: boolean
}) {
  const input = useNumberInput({ value: weight, onChange })

  return (
    <div style={{ marginBottom: tokens.spacing.md }}>
      <label>
        Finished weight (g) <input {...input.getInputProps()} />
      </label>
      {validationEnabled && <ClampNote result={clampNote} />}
    </div>
  )
}
