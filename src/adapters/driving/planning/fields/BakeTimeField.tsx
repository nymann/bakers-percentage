import { formatDatetimeLocal } from '../format'

export function BakeTimeField({
  bakeTime,
  onChange,
}: {
  bakeTime: Date
  onChange: (time: Date) => void
}) {
  return (
    <div className="mb-4">
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
