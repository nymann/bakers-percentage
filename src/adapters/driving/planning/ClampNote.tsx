import type { ClampResult } from '../../../domain/InputRanges'
import { formatRangeValue } from './format'

export function ClampNote({ result }: { result: ClampResult }) {
  if (!result.clamped) return null
  const { range } = result
  const min = formatRangeValue(range.min, range.unit)
  const max = formatRangeValue(range.max, range.unit)
  const suffix = range.unit
  return (
    <small className="text-on-surface-variant ml-2">
      Valid range: {min}–{max}{suffix}
    </small>
  )
}

export function StarterPercentClampNote({ result }: { result: ClampResult }) {
  if (!result.clamped) return null
  return (
    <small className="text-on-surface-variant ml-2">
      Base flour must remain positive
    </small>
  )
}
