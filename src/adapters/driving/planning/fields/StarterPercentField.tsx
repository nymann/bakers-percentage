import type { ClampResult } from '../../../../domain/InputRanges'
import { PercentField } from '../../../../design-system/molecules/PercentField'
import { StarterPercentClampNote } from '../ClampNote'

export function StarterPercentField({
  percent,
  onChange,
  clampNote,
  resetKey,
}: {
  percent: number
  onChange: (fraction: number) => void
  clampNote: ClampResult
  resetKey?: unknown
}) {
  return (
    <PercentField
      label="Starter"
      helperText="Starter mass relative to total flour. Higher ferments faster."
      percent={percent}
      onChange={onChange}
      resetKey={resetKey}
    >
      <StarterPercentClampNote result={clampNote} />
    </PercentField>
  )
}
