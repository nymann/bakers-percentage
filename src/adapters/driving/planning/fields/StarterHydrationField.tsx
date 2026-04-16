import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { tokens } from '../../../../design-system/tokens'
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
  const input = useNumberInput({
    value: Math.round(starterHydration * 100),
    onChange: (n) => onChange(n / 100),
    resetKey,
  })

  return (
    <div style={{ marginBottom: tokens.spacing.sm }}>
      <label>
        Starter hydration (%) <input {...input.getInputProps()} />
      </label>
      <ClampNote result={clampNote} />
    </div>
  )
}
