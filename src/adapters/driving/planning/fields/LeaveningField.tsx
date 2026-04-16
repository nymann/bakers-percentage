import type { YeastType } from '../../../../domain/Recipe'
import type { LeavingType } from '../../../../domain/SourdoughRecipe'
import { tokens } from '../../../../design-system/tokens'

export function LeaveningField({
  leavingType,
  yeastType,
  onSelectLeavening,
  onSelectYeastType,
}: {
  leavingType: LeavingType
  yeastType: YeastType
  onSelectLeavening: (type: LeavingType) => void
  onSelectYeastType: (type: YeastType) => void
}) {
  const selectValue = leavingType === 'sourdough' ? 'sourdough' : `yeast-${yeastType}`

  function handleChange(value: string) {
    if (value === 'sourdough') {
      onSelectLeavening('sourdough')
    } else if (value === 'yeast-instant') {
      onSelectLeavening('yeast')
      onSelectYeastType('instant')
    } else if (value === 'yeast-fresh') {
      onSelectLeavening('yeast')
      onSelectYeastType('fresh')
    }
  }

  return (
    <div style={{ marginBottom: tokens.spacing.md }}>
      <label>
        Leavening type{' '}
        <select value={selectValue} onChange={(e) => handleChange(e.target.value)}>
          <option value="sourdough">Sourdough</option>
          <option value="yeast-instant">Instant yeast</option>
          <option value="yeast-fresh">Fresh yeast</option>
        </select>
      </label>
    </div>
  )
}
