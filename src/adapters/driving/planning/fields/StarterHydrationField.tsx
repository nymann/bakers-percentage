import type { ClampResult } from '../../../../domain/InputRanges'
import { PercentField } from '../../../../design-system/molecules/PercentField'
import { ClampNote } from '../ClampNote'

export function StarterHydrationField({
  starterHydration,
  onChange,
  clampNote,
  resetKey,
}: {
  starterHydration: number
  onChange: (fraction: number) => void
  clampNote: ClampResult
  resetKey?: unknown
}) {
  return (
    <PercentField
      label="Starter hydration"
      helperText="Water-to-flour ratio in your active starter. 100% means equal parts."
      percent={starterHydration}
      onChange={onChange}
      resetKey={resetKey}
    >
      <ClampNote result={clampNote} />
    </PercentField>
  )
}
