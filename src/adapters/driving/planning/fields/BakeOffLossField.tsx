import type { ClampResult } from '../../../../domain/InputRanges'
import { PercentField } from '../../../../design-system/molecules/PercentField'
import { ClampNote } from '../ClampNote'

export function BakeOffLossField({
  bakeOffLoss,
  onChange,
  clampNote,
}: {
  bakeOffLoss: number
  onChange: (fraction: number) => void
  clampNote: ClampResult
}) {
  return (
    <PercentField
      label="Bake-off loss"
      helperText="Moisture that leaves the loaf in the oven. 12–15% is typical."
      percent={bakeOffLoss}
      onChange={onChange}
    >
      <ClampNote result={clampNote} />
    </PercentField>
  )
}
