import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
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
  const input = useNumberInput({
    value: Math.round(saltPercent * 100),
    onChange: (n) => onChange(n / 100),
  })

  return (
    <div className="mb-2">
      <label>
        Salt (%) <input {...input.getInputProps()} />
      </label>
      <ClampNote result={clampNote} />
    </div>
  )
}
