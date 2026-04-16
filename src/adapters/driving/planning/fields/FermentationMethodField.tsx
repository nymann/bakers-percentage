import type { FermentationMethod } from '../../../../domain/Fermentation'
import { tokens } from '../../../../design-system/tokens'

export function FermentationMethodField({
  method,
  onChange,
}: {
  method: FermentationMethod
  onChange: (method: FermentationMethod) => void
}) {
  return (
    <div style={{ marginBottom: tokens.spacing.sm }}>
      <label>
        Fermentation method{' '}
        <select
          value={method}
          onChange={(e) => onChange(e.target.value as FermentationMethod)}
        >
          <option value="same-day">Counter (same-day)</option>
          <option value="cold-retard">Fridge (overnight)</option>
        </select>
      </label>
    </div>
  )
}
