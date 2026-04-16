import type { ClampResult } from '../../../../domain/InputRanges'
import { PercentField } from '../../../../design-system/molecules/PercentField'
import { ClampNote } from '../ClampNote'

export function SaltField({
  saltPercent,
  onChange,
  clampNote,
}: {
  saltPercent: number
  onChange: (fraction: number) => void
  clampNote: ClampResult
}) {
  return (
    <PercentField
      label="Salt"
      helperText="Seasons the dough and tightens the gluten. 1.8–2.2% is typical."
      percent={saltPercent}
      onChange={onChange}
    >
      <ClampNote result={clampNote} />
    </PercentField>
  )
}
