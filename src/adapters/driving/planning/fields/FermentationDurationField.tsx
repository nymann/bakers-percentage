import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { tokens } from '../../../../design-system/tokens'
import { ClampNote } from '../ClampNote'

export function FermentationDurationField({
  hours,
  onChange,
  clampNote,
  validationEnabled,
  resetKey,
}: {
  hours: number
  onChange: (hours: number) => void
  clampNote: ClampResult
  validationEnabled: boolean
  resetKey?: unknown
}) {
  const input = useNumberInput({ value: hours, onChange, resetKey })

  return (
    <div style={{ marginBottom: tokens.spacing.sm }}>
      <label>
        Fermentation duration (h) <input {...input.getInputProps()} />
      </label>
      {validationEnabled && <ClampNote result={clampNote} />}
    </div>
  )
}
