import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { tokens } from '../../../../design-system/tokens'
import { StarterPercentClampNote } from '../ClampNote'

export function StarterPercentField({
  percent,
  onChange,
  clampNote,
  validationEnabled,
  resetKey,
}: {
  percent: number
  onChange: (fraction: number) => void
  clampNote: ClampResult
  validationEnabled: boolean
  resetKey?: unknown
}) {
  const input = useNumberInput({
    value: Math.round(percent * 100),
    onChange: (n) => onChange(n / 100),
    resetKey,
  })

  return (
    <div style={{ marginBottom: tokens.spacing.md }}>
      <label>
        Starter (%) <input {...input.getInputProps()} />
      </label>
      {validationEnabled && <StarterPercentClampNote result={clampNote} />}
    </div>
  )
}
