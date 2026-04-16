import type { ClampResult } from '../../../domain/InputRanges'
import { tokens } from '../../../design-system/tokens'
import { formatRangeValue } from './format'

export function ClampNote({ result }: { result: ClampResult }) {
  if (!result.clamped) return null
  const { range } = result
  const min = formatRangeValue(range.min, range.unit)
  const max = formatRangeValue(range.max, range.unit)
  const suffix = range.unit
  return (
    <small style={{ color: tokens.colors.textMuted, marginLeft: tokens.spacing.sm }}>
      Valid range: {min}–{max}{suffix}
    </small>
  )
}

export function StarterPercentClampNote({ result }: { result: ClampResult }) {
  if (!result.clamped) return null
  return (
    <small style={{ color: tokens.colors.textMuted, marginLeft: tokens.spacing.sm }}>
      Base flour must remain positive
    </small>
  )
}
