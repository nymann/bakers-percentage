import type { ClampResult } from '../../../../domain/InputRanges'
import { useNumberInput } from '../../../../design-system/headless/useNumberInput'
import { ClampNote } from '../ClampNote'

export function LoafCountField({
  loaves,
  onChange,
  clampNote,
}: {
  loaves: number
  onChange: (count: number) => void
  clampNote: ClampResult
}) {
  const input = useNumberInput({ value: loaves, onChange })

  return (
    <div className="mb-4">
      <label>
        Loaf count <input {...input.getInputProps()} />
      </label>
      <ClampNote result={clampNote} />
    </div>
  )
}
