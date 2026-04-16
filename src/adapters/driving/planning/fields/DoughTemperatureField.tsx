import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { ClampNote } from '../ClampNote'

export function DoughTemperatureField({
  doughTemperature,
  onChange,
  clampNote,
  resetKey,
}: {
  doughTemperature: number
  onChange: (tempC: number) => void
  clampNote: ClampResult
  resetKey?: unknown
}) {
  const input = useNumberInput({
    value: doughTemperature,
    onChange,
    resetKey,
  })

  return (
    <div className="mb-2">
      <label>
        Dough temperature (°C) <input {...input.getInputProps()} />
      </label>
      <ClampNote result={clampNote} />
    </div>
  )
}
