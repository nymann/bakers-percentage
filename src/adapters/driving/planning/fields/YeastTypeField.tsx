import type { YeastType } from '../../../../domain/Recipe'
import { tokens } from '../../../../design-system/tokens'

export function YeastTypeField({
  yeastType,
  onSelectYeastType,
}: {
  yeastType: YeastType
  onSelectYeastType: (type: YeastType) => void
}) {
  return (
    <div style={{ marginBottom: tokens.spacing.md }}>
      <label>
        Yeast type{' '}
        <select
          value={yeastType}
          onChange={(e) => onSelectYeastType(e.target.value as YeastType)}
        >
          <option value="instant">Instant</option>
          <option value="fresh">Fresh</option>
        </select>
      </label>
    </div>
  )
}
