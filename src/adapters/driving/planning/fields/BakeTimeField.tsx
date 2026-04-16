import { tokens } from '../../../../design-system/tokens'
import { formatDatetimeLocal } from '../format'

export function BakeTimeField({
  bakeTime,
  onChange,
}: {
  bakeTime: Date
  onChange: (time: Date) => void
}) {
  return (
    <div style={{ marginBottom: tokens.spacing.md }}>
      <label>
        Bake time{' '}
        <input
          type="datetime-local"
          value={formatDatetimeLocal(bakeTime)}
          onChange={(e) => onChange(new Date(e.target.value))}
        />
      </label>
    </div>
  )
}
