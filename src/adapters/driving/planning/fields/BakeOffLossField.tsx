import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
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
  const input = useNumberInput({
    value: Math.round(bakeOffLoss * 100),
    onChange: (n) => onChange(n / 100),
  })

  return (
    <div className="mb-2">
      <label>
        Bake-off loss (%) <input {...input.getInputProps()} />
      </label>
      <ClampNote result={clampNote} />
    </div>
  )
}
