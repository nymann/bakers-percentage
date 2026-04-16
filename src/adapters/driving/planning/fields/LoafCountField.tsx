import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { tokens } from '../../../../design-system/tokens'
import { ClampNote } from '../ClampNote'

export function LoafCountField({
  loaves,
  onChange,
  clampNote,
  validationEnabled,
}: {
  loaves: number
  onChange: (count: number) => void
  clampNote: ClampResult
  validationEnabled: boolean
}) {
  const input = useNumberInput({ value: loaves, onChange })

  return (
    <div style={{ marginBottom: tokens.spacing.md }}>
      <label>
        Loaf count <input {...input.getInputProps()} />
      </label>
      {validationEnabled && <ClampNote result={clampNote} />}
    </div>
  )
}
